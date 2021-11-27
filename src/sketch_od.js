const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 480;
let video;
let ready = false;
let objectDetector;
let objects = [];

function setup() {
  createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  video = createCapture(VIDEO, () => {
    ready = true;
    objectDetector = ml5.objectDetector('yoro', {}, () => {
      console.log('model loaded');
      startObjectDetection();
    });
  });
  video.size(IMAGE_WIDTH, IMAGE_HEIGHT);
  video.hide();
}

function startObjectDetection() {
  objectDetector.detect(video, gotResults);
}

function gotResults(error, results) {
  if (error) {
    return;
  }
  objects = results;
  startObjectDetection();
}

function draw() {
  if (!ready) return;

  image(video, 0, 0, width, height);

  objects.forEach(drawObject);
}

function drawObject(object) {
  stroke(0, 255, 0);
  strokeWeight(4);
  noFill();
  rect(object.x, object.y, object.width, object.height);
  noStroke();
  fill(255);
  textSize(24);
  text(object.label, object.x + 10, object.y + 24);
}
