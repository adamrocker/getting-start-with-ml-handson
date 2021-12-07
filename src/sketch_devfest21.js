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
    learningRate: 0.01,
    debug: true,
  };
  nn = ml5.neuralNetwork(options);

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
  text(
    `グー: ${countRock} / チョキ: ${countScissors} / パー: ${countPaper}`,
    width / 2,
    height - 16
  );

  textSize(64);
  text(dict[label], width / 2, height / 2);
}
