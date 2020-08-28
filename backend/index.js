/**
 * Dependencies
 */

express = require("express");
const admin = require("firebase-admin");
const inspect = require("util").inspect;
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const UUID = require("uuid-v4");

/**
 * config-express
 */

const app = express();

/**
 * config - firebase
 */

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "fairgram-bf8f5.appspot.com"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

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

app.post("/createPost", function(request, response) {
  response.set("Access-Control-Allow-Origin", "*");

  const busboy = new Busboy({ headers: request.headers });
  const fields = {};
  const uuid = UUID();
  let fileData = {};

  busboy.on("file", function(fieldname, file, filename, encoding, mimetype) {
    console.log(
      `File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`
    );
    // /tmp/44353-34543.png
    const filepath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filepath));
    fileData = { filepath, mimetype };
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
    bucket.upload(
      fileData.filepath,
      {
        uploadType: "media",
        metadata: {
          metadata: {
            contentType: fileData.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile);
        }
      }
    );

    async function createDocument(uploadedFile) {
      fields.date = +fields.date;
      await db
        .collection("posts")
        .doc(fields.id)
        .set({
          ...fields,
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
        });
      response.send(`Done: ${fields.id}`);
    }
  });

  request.pipe(busboy);
});

/**
 * listen
 */

app.listen(process.env.PORT || 3000);
