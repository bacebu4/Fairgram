/**
 * Dependencies
 */

express = require("express");
const admin = require("firebase-admin");

/**
 * config-express
 */

const app = express();

/**
 * config - firebase
 */

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * endpoint - posts
 */

app.get("/posts", (request, response) => {
  const posts = [
    {
      caption: "Golden Gate Bridge",
      location: "San Francisco"
    },
    {
      caption: "London Eye",
      location: "London"
    }
  ];
  response.send(posts);
});

/**
 * listen
 */

app.listen(process.env.PORT || 3000);
