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
let loss = 0;

function setup() {
  createCanvas(640, 640);
  video = createCapture(VIDEO, () => {
    ready = true;
  });
  video.size(IMAGE_SIZE, IMAGE_SIZE);
  video.hide();

  const featureExtractor = ml5.featureExtractor('MobileNet', () => {
    console.log('MobileNet Loaded!');
  });
  const options = { numLabels: 2, version: 1 };
  nn = featureExtractor.classification(video, options);

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
    nn.train((lossValue) => {
      if (lossValue == null) {
        startClassify();
        return;
      } else {
        loss = lossValue;
      }
    });
  });

  const saveBtn = createButton('save');
  saveBtn.mousePressed(() => {
    nn.save();
  });

  const loadBtn = createButton('load');
  loadBtn.mousePressed(() => {
    nn.load('./model/model.json', () => {
      console.log('model loaded!');
      startClassify();
    });
  });
}

function startClassify() {
  nn.classify(gotResults);
}

function gotResults(error, results) {
  if (error) {
    return;
  }
  label = results[0].label;
  startClassify();
}

function addData(label) {
  nn.addImage(label);
}

function draw() {
  if (!ready) return;

  image(video, 0, 0, width, height);

  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255); // white
  text(
    `mask: ${countMask} / face: ${countFace} / Loss: ${loss}`,
    width / 2,
    height - 16
  );

  textSize(64);
  text(label, width / 2, height / 2);
}
