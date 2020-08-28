/**
 * Dependencies
 */

express = require("express");
const admin = require("firebase-admin");
const inspect = require("util").inspect;
const Busboy = require("busboy");

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

app.post("/createPost", async function(request, response) {
  response.set("Access-Control-Allow-Origin", "*");

  const busboy = new Busboy({ headers: request.headers });

  busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
    console.log(
      `File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`
    );
    file.on("data", function(data) {
      console.log(`File [${fieldname}] got ${data.length} bytes`);
    });
    file.on("end", function() {
      console.log(`File [${fieldname}] Finished`);
    });
  });

  busboy.on("field", function(
    fieldname,
    val,
    fieldnameTruncated,
    valTruncated,
    encoding,
    mimetype
  ) {
    console.log(`Field [${fieldname}]: value: ${inspect(val)}`);
  });

  busboy.on("finish", function() {
    console.log("Done parsing form!");
    // response.writeHead(303, { Connection: "close", Location: "/" });
    response.send("Done!");
  });
  request.pipe(busboy);
});

/**
 * listen
 */

app.listen(process.env.PORT || 3000);
