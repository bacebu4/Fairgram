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
  const fields = {};

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
    fields[fieldname] = val;
  });

  busboy.on("finish", async function() {
    fields.date = +fields.date;
    await db
      .collection("posts")
      .doc(fields.id)
      .set({
        ...fields,
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/fairgram-bf8f5.appspot.com/o/photo-1470016342826-876ea880d0be.jpeg?alt=media&token=b6ee9b5f-1f01-4107-b083-98df1bad6aa7"
      });
    response.send("Done!");
  });
  request.pipe(busboy);
});

/**
 * listen
 */

app.listen(process.env.PORT || 3000);
