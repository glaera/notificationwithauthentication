// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var webPush = require('web-push');
const oauth2 = require('../lib/oauth2');


function getModel () {
  return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());


router.get('/', (req, res, next) => {
  getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      items: entities,
      nextPageToken: cursor
    });
  });
});

/**
 * POST /api/books
 *
 * Create a new book.
 */
router.post('/send-push-msg', (req, res, next) => {
  
  let subscription = req.query.subscription;
  
  try {
    let pushSubscription = {
        endpoint: req.query.endpoint,
        keys: {
            p256dh: req.query.p256dh,
            auth: req.query.auth
        },
        ipaddress:req.connection.remoteAddress
    }

    if (req.user) {
      pushSubscriptioncreatedBy = req.user.displayName;
      pushSubscription.createdById = req.user.id;
    } else {
      pushSubscription.createdBy = 'Anonymous';
    }

    getModel().create(pushSubscription, (err, entity) => {
      if (err) {
        return;
      }
      
    });

    // TODO 4.3a - include VAPID keys
    
    var payload = 'Here is a payload!';
    
    var options = {
      gcmAPIKey: 'AAAA4hP27WY:APA91bHDBs-UYMCEmjriFRauvsbI4cHTWzow-pLWAEBjQTOxfKKwO8x7x7NLs_CdiuRr0H1SKX_07pdo8TRhMlTjqVG7eNb7ih9dwzvXPYO4ZzDzC_M9PO_Tka6BnKk68P95PUxgcGPV',
      TTL: 60,
    
      // TODO 4.3b - add VAPID details
    
    };
    
    webPush.sendNotification(
      pushSubscription,
      payload,
      options
    );
  }
  catch(err) {
      console.log(' error',err)
  }
  
});

/**
 * GET /api/books/:id
 *
 * Retrieve a book.
 */
router.get('/:book', (req, res, next) => {
  getModel().read(req.params.book, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * PUT /api/books/:id
 *
 * Update a book.
 */
router.put('/:book', (req, res, next) => {
  getModel().update(req.params.book, req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * DELETE /api/books/:id
 *
 * Delete a book.
 */
router.delete('/:book', (req, res, next) => {
  getModel().delete(req.params.book, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).send('OK');
  });
});




/**
 * Errors on "/api/books/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = {
    message: err.message,
    internalCode: err.code
  };
  next(err);
});

module.exports = router;
