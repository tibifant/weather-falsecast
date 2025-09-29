# run with `python3 -i train.py`

print("Loading Dependencies...")

import torch
from torch import nn
import pandas as pd

from torch.utils.data import TensorDataset, DataLoader, Dataset

from json import JSONEncoder
import json

device = torch.device("cpu") # "cuda" on nvidia gpus

print("Loading Data...")
inputTensor = torch.tensor(pd.read_csv('inputDataS.csv').to_numpy(), device=device, dtype=torch.float32)
outputTensor = torch.tensor(pd.read_csv('outputDataS.csv').to_numpy(), device=device, dtype=torch.float32)

class NeuralNetwork(nn.Module):
	def __init__(self):
		super().__init__()
		self.flatten = nn.Flatten()
		self.linear_relu_stack = nn.Sequential(
			nn.Linear(12+3, 64),
			nn.ReLU(),
			nn.Linear(64, 64),
			nn.ReLU(),
			nn.Linear(64, 64),
			nn.ReLU(),
			nn.Linear(64, 64),
			nn.ReLU(),
			nn.Linear(64, 64),
			nn.ReLU(),
			nn.Linear(64, 64),
			nn.ReLU(),
			nn.Linear(64, 3*4),
		)

	def forward(self, x):
		logits = self.linear_relu_stack(x)
		return logits

model = NeuralNetwork().to(device)

learning_rate = 5e-4
epochs = 5
clip_value = 5
batch_size = 128

loss_fn = nn.CrossEntropyLoss()

optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)
dataset = TensorDataset(inputTensor, outputTensor)
train_dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=False)

def train_loop(inData, outData, model, loss_fn, optimizer):
	size = len(inData)
	# Set the model to training mode - important for batch normalization and dropout layers
	# Unnecessary in this situation but added for best practices
	model.train()
	for i in range(len(inData)):
		# Compute prediction and loss
		pred = model(inData[i])
		loss = loss_fn(pred, outData[i])
		
		# Backpropagation
		loss.backward()
		#torch.nn.utils.clip_grad_norm_(model.parameters(), clip_value) # if hit with NaN 
		optimizer.step()
		optimizer.zero_grad()

		if i % 1000 == 0:
			loss = loss.item()
			print(f"loss: {loss:>7f} [{i:>5d}/{size:>5d}]")


def train_loop2(dataloader, model, loss_fn, optimizer):
  size = len(dataloader.dataset)
  # Set the model to training mode - important for batch normalization and dropout layers
  # Unnecessary in this situation but added for best practices
  model.train()
  for batch, (X, y) in enumerate(dataloader):
    # Compute prediction and loss
    pred = model(X)
    loss = loss_fn(pred, y)

    # Backpropagation
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()
		
    if batch % 1000 == 0:
      loss, current = loss.item(), batch * batch_size + len(X)
      print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")


def test_loop(inData, outData, model, loss_fn):
	# Set the model to evaluation mode - important for batch normalization and dropout layers
	# Unnecessary in this situation but added for best practices
	model.eval()
	size = 10000
	test_loss, accum_dist = 0, 0

	# Evaluating the model with torch.no_grad() ensures that no gradients are computed during test mode
	# also serves to reduce unnecessary gradient computations and memory usage for tensors with requires_grad=True
	with torch.no_grad():
		for i in range(size):
			pred = model(inData[len(inData) - 1 - i])
			y = outData[len(inData) - 1 - i]
			test_loss += loss_fn(pred, y).item()
			accum_dist += torch.dist(pred, y)
	
	test_loss /= size
	accum_dist /= size
	print(f"Test Error: avg dist: {(accum_dist):>0f}, avg loss: {test_loss:>8f} \n")

def save_model(model, filename):
	torch.save(model.state_dict(), filename)

def load_model(model, filename):
	model.load_state_dict(torch.load(filename))

def save_model_json(model, filename):
	class EncodeTensor(JSONEncoder,Dataset):
		def default(self, obj):
			if isinstance(obj, torch.Tensor):
				return obj.cpu().detach().numpy().tolist()
			return super(EncodeTensor, self).default(obj)
	
	with open(filename, 'w') as json_file:
		json.dump(model.state_dict(), json_file,cls=EncodeTensor)

print("model can now be trained with: `train_loop(inputTensor, outputTensor, model, loss_fn, optimizer)` (one iteration)\nwith dataloader: `train_loop2(train_dataloader, model, loss_fn, optimizer)`\nto store: `save_model(model, \"modelS.pth\")`\nto load: `load_model(model, \"modelS.pth\")`\nto save model as json: `save_model_json(model, \"modelS.json\")`\nglhf\n")
