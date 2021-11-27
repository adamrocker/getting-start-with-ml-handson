let label;
let confidence;

function setup() {
  noCanvas();

  label = createDiv('Label: ...');
  confidence = createDiv('Confidence: ...');

  const classifier = ml5.soundClassifier('SpeechCommands18w', {
    probabilityThreshold: 0.9,
  });

  classifier.classify(gotResults);
}

function gotResults(error, results) {
  if (error) {
    return;
  }
  label.html(`Label: ${results[0].label}`);
  confidence.html(`Confidence: ${nf(results[0].confidence, 0, 2)}`); // Round the confidence to 0.01
}
