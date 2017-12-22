'use strict';

function detectLabelsGCS(bucketName, fileName, cb) {
    // [START vision_label_detection_gcs]
    // Imports the Google Cloud client libraries
    const vision = require('@google-cloud/vision');
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    // const bucketName = 'Bucket where the file resides, e.g. my-bucket';
    // const fileName = 'Path to file within bucket, e.g. path/to/image.png';
  
    // Performs label detection on the gcs file
    client
      .labelDetection(`gs://${bucketName}/${fileName}`)
      .then(results => {
        const labels = results[0].labelAnnotations;
        console.log('GENNARO ',results[0])
        cb(labels);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
    // [END vision_label_detection_gcs]
  }


function detectTextGCS(bucketName, fileName,cb) {
  // [START vision_text_detection_gcs]
  // Imports the Google Cloud client libraries
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Bucket where the file resides, e.g. my-bucket';
  // const fileName = 'Path to file within bucket, e.g. path/to/image.png';

  // Performs text detection on the gcs file
  client
    .textDetection(`gs://${bucketName}/${fileName}`)
    .then(results => {
      const detections = results[0].textAnnotations;
      console.log('Text:');
      detections.forEach(text => console.log(text));
      cb(detections);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END vision_text_detection_gcs]
}

function detectLandmarksGCS(bucketName, fileName,cb) {
  // [START vision_landmark_detection_gcs]
  // Imports the Google Cloud client libraries
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const bucketName = 'Bucket where the file resides, e.g. my-bucket';
  // const fileName = 'Path to file within bucket, e.g. path/to/image.png';

  // Performs landmark detection on the gcs file
  client
    .landmarkDetection(`gs://${bucketName}/${fileName}`)
    .then(results => {
      const landmarks = results[0].landmarkAnnotations;
      console.log('Landmarks:');
      landmarks.forEach(landmark => console.log(landmark));
      cb(landmarks);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END vision_landmark_detection_gcs]
}

  module.exports = {detectLandmarksGCS,detectLabelsGCS,detectTextGCS};