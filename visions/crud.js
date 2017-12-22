'use strict';

const express = require('express');
const images = require('../lib/images');
const oauth2 = require('../lib/oauth2');
const bodyParser = require('body-parser');
const config = require('../config');
var webPush = require('web-push');
const {detectLandmarksGCS,detectLabelsGCS,detectTextGCS} = require('./detect');

const CLOUD_BUCKET = config.get('CLOUD_BUCKET');

function getModel () {
  return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

const router = express.Router();

// Use the oauth middleware to automatically get the user's profile
// information and expose login/logout URLs to templates.
router.use(oauth2.template);

router.use(bodyParser.json());


// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});


router.get('/', (req, res, next) => {
  getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.render('visions/list.pug', {
      images: entities,
      nextPageToken: cursor
    });
  });
});


router.get('/add', (req, res) => {
  res.render('visions/form.pug', {
    data: {},
    action: 'Analyze'
  });
});


router.post(
  '/add',
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res, next) => {
    const data = req.body;

    // If the user is logged in, set them as the creator of the book.
    if (req.user) {
      data.createdBy = req.user.displayName;
      data.createdById = req.user.id;
    } else {
      data.createdBy = 'Anonymous';
    }

    // Was an image uploaded? If so, we'll use its public URL
    // in cloud storage.
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
      data.gCSResource = req.file.cloudStorageObject ;
    }

    // Save the data to the database.
    getModel().create(data, (err, savedData) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect(`${req.baseUrl}/${savedData.id}`);
    });
  }
);


router.get('/:dataid', (req, res, next) => {
  getModel().read(req.params.dataid, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    detectLandmarksGCS(CLOUD_BUCKET,entity.gCSResource,(landmarks)=>{
      detectTextGCS(CLOUD_BUCKET,entity.gCSResource,(text)=>{
        detectLabelsGCS(CLOUD_BUCKET,entity.gCSResource,(labels)=>{
          res.render('visions/view.pug', {
            data: entity,
            labels: labels,
            text: text,
            landmarks: landmarks 
          });
        });
      });  
    });
   
  });
});

router.get('/:dataid/delete', (req, res, next) => {
  getModel().delete(req.params.dataid, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(req.baseUrl);
  });
});




router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
