const IMAGE_SIZE = 64;
const IMAGE_CHANNELS = 4; // RGBA
const LABEL_ROCK = 'rock';
const LABEL_PAPER = 'paper';
const LABEL_SCISSORS = 'scissors';
const dict = {
  [LABEL_ROCK]: 'グー',
  [LABEL_PAPER]: 'パー',
  [LABEL_SCISSORS]: 'チョキ',
};

let video;
let ready = false;
let label;
let nn;
let countRock = 0;
let countPaper = 0;
let countScissors = 0;
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
  const options = { numLabels: 3, version: 1 };
  nn = featureExtractor.classification(video, options);

  const rockBtn = createButton(LABEL_ROCK);
  rockBtn.mousePressed(() => {
    countRock++;
    addData(LABEL_ROCK);
  });

  const scissorsBtn = createButton(LABEL_SCISSORS);
  scissorsBtn.mousePressed(() => {
    countScissors++;
    addData(LABEL_SCISSORS);
  });

  const paperBtn = createButton(LABEL_PAPER);
  paperBtn.mousePressed(() => {
    countPaper++;
    addData(LABEL_PAPER);
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

  textSize(24);
  textAlign(CENTER, CENTER);
  fill(255); // white
  text(
    `グー: ${countRock} / チョキ: ${countScissors} / パー: ${countPaper} / Loss: ${loss}`,
    width / 2,
    height - 16
  );

  textSize(64);
  text(dict[label], width / 2, height / 2);
}
