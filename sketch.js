let mono_light;
let mono_bold;

// Called once when the program starts just before setup().
// Use this to load external data, i.e. make your API calls here.
// See https://p5js.org/reference/#/p5/preload
function preload() {
  weatherPreload();
  mono_light = loadFont("assets/IBM_Plex_Mono/IBMPlexMono-Light.ttf");
  mono_bold = loadFont("assets/IBM_Plex_Mono/IBMPlexMono-Bold.ttf");
}

// Called once when the program starts.
// See https://p5js.org/reference/#/p5/setup
function setup() {
  createCanvas(1920, 1080);
  frameRate(60);
  textFont(mono_light);
  
  weatherSetup();
}

// Called over and over to refresh your visualisation.
// See https://p5js.org/reference/#/p5/draw
function draw() {
  colorMode(RGB);
  background(4, 4, 4);
  noFill();
  colorMode(RGB);
  weatherDraw();
}