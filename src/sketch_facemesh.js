const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 480;
let video;
let ready = false;
let mesh = [];

function setup() {
  createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  video = createCapture(VIDEO, () => {
    ready = true;
    const facemesh = ml5.facemesh(video, () => {
      console.log('model loaded');
    });

    // Listen to new 'predict' events
    facemesh.on('predict', (results) => {
      if (results && results.length > 0) {
        mesh = results[0].scaledMesh;
        console.log(mesh);
      }
    });
  });
  video.size(IMAGE_WIDTH, IMAGE_HEIGHT);
  video.hide();
}

function draw() {
  if (!ready) return;

  image(video, 0, 0, width, height);

  drawKeypoints();
}

function drawKeypoints() {
  for (let i = 0; i < mesh.length; i++) {
    const [x, y] = mesh[i];

    fill(0, 255, 0);
    ellipse(x, y, 5, 5);
  }
}
