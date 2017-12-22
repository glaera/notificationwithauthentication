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
      });
    // [END vision_label_detection_gcs]
  }

  module.exports = detectLabelsGCS;