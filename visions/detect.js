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
        cb(labels);
      })
      .catch(err => {
        console.error('ERROR:', err);
        cb({err:err});
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
      cb(detections);
    })
    .catch(err => {
      console.error('ERROR:', err);
      cb({err:err});
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
      cb(landmarks);
    })
    .catch(err => {
      console.error('ERROR:', err);
      cb({err:err});
    });
  // [END vision_landmark_detection_gcs]
}


function detectWebEntitiesGCS(bucketName, fileName,cb) {
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
    .webDetection(`gs://${bucketName}/${fileName}`)
    .then(results => {
      const webDetection = results[0].webDetection;
      cb(webDetection);
    })
    .catch(err => {
      console.error('ERROR:', err);
      cb({err:err});
    });
  // [END vision_landmark_detection_gcs]
}


  module.exports = {detectWebEntitiesGCS,detectLandmarksGCS,detectLabelsGCS,detectTextGCS};