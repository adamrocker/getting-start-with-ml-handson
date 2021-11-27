let score;
let sentiment;
let ready = false;

function setup() {
  noCanvas();

  const inp = createInput('');
  inp.position(10, 10);
  inp.size(300, 64);
  inp.input(myInputEvent);

  score = createDiv();
  score.position(10, 96);

  sentiment = ml5.sentiment('movieReviews', () => {
    ready = true;
    console.log('Model Loaded!');
  });
}

function myInputEvent(event) {
  if (ready) {
    const text = event.target.value;
    const prediction = sentiment.predict(text);
    score.html(`Score: ${prediction.score}`);
  }
}
