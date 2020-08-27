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

app.get("/posts", async function(request, response) {
  response.set("Access-Control-Allow-Origin", "*");

  const posts = [];

  const snapshot = await db
    .collection("posts")
    .orderBy("date", "desc")
    .get();
  snapshot.forEach(doc => {
    posts.push(doc.data());
  });

  response.send(posts);
});

/**
 * endpoint - createPosts
 */

app.get("/createPost", async function(request, response) {
  response.set("Access-Control-Allow-Origin", "*");

  response.send("createPost");
});

/**
 * listen
 */

app.listen(process.env.PORT || 3000);
