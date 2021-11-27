const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 480;
let video;
let ready = false;
let bodypix;
let segmentation;

function setup() {
  createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  video = createCapture(VIDEO, () => {
    ready = true;
    bodypix = ml5.bodyPix({
      outputStride: 8, // 8, 16, or 32, default is 16
      segmentationThreshold: 0.3, // 0 - 1, defaults to 0.5
    });
    startBodySegmentation();
  });
  video.size(IMAGE_WIDTH, IMAGE_HEIGHT);
  video.hide();
}

function startBodySegmentation() {
  bodypix.segment(video, gotResults);
}

function gotResults(error, result) {
  if (error) {
    return;
  }
  segmentation = result;
  startBodySegmentation();
}

function draw() {
  if (!ready) return;

  background(0, 255, 0);
  if (segmentation) {
    image(segmentation.backgroundMask, 0, 0, width, height);
  }
}
