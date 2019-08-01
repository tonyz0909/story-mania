/* eslint-env node */

const express = require('express');
// const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

// load .env files
// require('dotenv').config()

const firebase = require('./routes/firebase');

/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
  const app = express();

  // Redirect HTTP to HTTPS,
//   app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));


  app.get('/firebase', firebase.getFirebase);
  app.get('/push', firebase.pushToFirebase);
  app.get('/createGame', firebase.createGame);
  app.get('/getGame', firebase.getGame);
  app.get('/createUser', firebase.createUser);
  app.get('/addWord', firebase.addWord);
  app.get('/test', function (req, res) {
    res.send('Hello World!')
  });


  // Start the server
  return app.listen('8000', () => {
    // eslint-disable-next-line no-console
    console.log('Local DevServer Started on port 8000...');
  });
}

startServer();
