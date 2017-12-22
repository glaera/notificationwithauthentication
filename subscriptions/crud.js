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
const images = require('../lib/images');
const oauth2 = require('../lib/oauth2');
const bodyParser = require('body-parser');
var webPush = require('web-push');


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

/**
 * GET /books/add
 *
 * Display a page of books (up to ten at a time).
 */
router.get('/', (req, res, next) => {
  getModel().list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/list.pug', {
      books: entities,
      nextPageToken: cursor
    });
  });
});

// [START mine]
// Use the oauth2.required middleware to ensure that only logged-in users
// can access this handler.
router.get('/mine', oauth2.required, (req, res, next) => {
  getModel().listBy(
    req.user.id,
    10,
    req.query.pageToken,
    (err, entities, cursor, apiResponse) => {
      if (err) {
        next(err);
        return;
      }
      res.render('books/list.pug', {
        books: entities,
        nextPageToken: cursor
      });
    }
  );
});
// [END mine]


router.post('/broadcast', (req, res) => {
  let subscriptionIds = req.body.subscriptionId;
  if (subscriptionIds) {
      if (!Array.isArray(subscriptionIds) ) {
        subscriptionIds = [subscriptionIds];
      }
      let message = req.body.message;
      
      subscriptionIds.forEach(id=>{
        getModel().read(id, (err, entity) => {
          if (err) {
            next(err);
            return;
          }
      
      
          try {
            const pushSubscription = entity;
            
            var payload = message;
            
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
      });
  
  }

  res.redirect(`/subscriptions`);

});


router.post('/delete', (req, res) => {
  let subscriptionIds = req.body.subscriptionId;
  if (subscriptionIds) {
      if (!Array.isArray(subscriptionIds) ) {
        subscriptionIds = [subscriptionIds];
      }
      let message = req.body.message;
      
      subscriptionIds.forEach(id=>{
        getModel().delete(id, (err) => {
          if (err) {
            //res.redirect(`/subscriptions`);``
            return;
          }
          //res.redirect(`/subscriptions`);
        });
      });
  
  }
  res.redirect(`/subscriptions`);
  

});

/**
 * GET /books/:id/edit
 *
 * Display a book for editing.
 */
router.get('/:book/edit', (req, res, next) => {
  getModel().read(req.params.book, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/form.pug', {
      book: entity,
      action: 'Edit'
    });
  });
});

/**
 * POST /books/:id/edit
 *
 * Update a book.
 */
router.post(
  '/:book/edit',
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res, next) => {
    const data = req.body;

    // Was an image uploaded? If so, we'll use its public URL
    // in cloud storage.
    if (req.file && req.file.cloudStoragePublicUrl) {
      req.body.imageUrl = req.file.cloudStoragePublicUrl;
    }

    getModel().update(req.params.book, data, (err, savedData) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect(`${req.baseUrl}/${savedData.id}`);
    });
  }
);

/**
 * GET /books/:id
 *
 * Display a book.
 */
router.get('/:book', (req, res, next) => {
  
  getModel().read(req.params.book, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/view.pug', {
      book: entity
    });
  });
});

/**
 * GET /books/:id/delete
 *
 * Delete a book.
 */
router.get('/:book/delete', (req, res, next) => {
  getModel().delete(req.params.book, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(req.baseUrl);
  });
});

router.post('/unsubscribe', oauth2.required, (req, res, next) => {
  console.log(' UNSUBSCRIBE')
  getModel().deleteBy(
    req.user.id);
    res.redirect(req.baseUrl);
});



router.post('/send-push-msg', (req, res, next) => {
  
  let subscription = req.query.subscription;
  console.log(' /send-push-msg',req.user); 


  
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
      pushSubscription.createdBy = req.user.displayName;
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
 * Errors on "/books/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
