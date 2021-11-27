const IMAGE_SIZE = 64;
const IMAGE_CHANNELS = 4; // RGBA
const LABEL_MASK = 'mask';
const LABEL_FACE = 'face';

let video;
let ready = false;
let label;
let nn;
let countMask = 0;
let countFace = 0;

function setup() {
  createCanvas(640, 640);
  video = createCapture(VIDEO, () => {
    ready = true;
  });
  video.size(IMAGE_SIZE, IMAGE_SIZE);
  video.hide();

  const options = {
    inputs: [IMAGE_SIZE, IMAGE_SIZE, IMAGE_CHANNELS], // RGBA
    task: 'imageClassification',
    debug: true,
  };
  nn = ml5.neuralNetwork(options);

  const maskBtn = createButton(LABEL_MASK);
  maskBtn.mousePressed(() => {
    countMask++;
    addData(LABEL_MASK);
  });

  const faceBtn = createButton(LABEL_FACE);
  faceBtn.mousePressed(() => {
    countFace++;
    addData(LABEL_FACE);
  });

  const trainBtn = createButton('train');
  trainBtn.mousePressed(() => {
    nn.normalizeData();
    nn.train({ epochs: 50 }, () => {
      startClassify();
    });
  });
}

function startClassify() {
  const inputImage = {
    image: video,
  };
  nn.classify(inputImage, gotResults);
}

function gotResults(error, results) {
  if (error) {
    return;
  }
  label = results[0].label;
  startClassify();
}

function addData(label) {
  const inputImage = {
    image: video,
  };
  const target = {
    label,
  };
  nn.addData(inputImage, target);
}

function draw() {
  if (!ready) return;

  image(video, 0, 0, width, height);

  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255); // white
  text(`mask: ${countMask} / face: ${countFace}`, width / 2, height - 16);

  textSize(64);
  text(label, width / 2, height / 2);
}
