const express = require("express");
const credentials = require("./credentials.json");
const { initializeApp, getApps, cert } = require("firebase-admin/app");

const app = express();
const { getFirestore } = require("firebase-admin/firestore");
app.use(express.json());
//const { app } = require("firebase-admin");

function connectToFirestore() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(credentials),
    });
  }
  return getFirestore();
}
const db = connectToFirestore();
const seafoodRef = db.collection("seafood");

// app.post("/seafood", (req, res) => {
//   const db = connectToFirestore();
//   seafoodRef
//     .add(req.body)
//     .then(() => res.send("Seafood Added!"))
//     .catch(console.error);
// });

// app.patch("/updateItem", (req, res) => {
//   db.collection("seafood")
//     .doc("JzQ1sbyDKpXsS7EGnOUb")
//     .update({ price: "2.99" })
//     .then(() => res.send("Salmon Updated!"));
// });

app.get("/coll", (req, res) => {
  seafoodRef
    .get()
    .then((snapshot) => {
      const seafood = snapshot.docs.map((doc) => {
        let seafood = doc.data();
        seafood.id = doc.id;
        return seafood;
      });
      res.status(200).send(seafood);
    })
    .catch(console.error);
});

app.get("/prod/:seafoodId", (req, res) => {
  console.log("my param request", req.params);
  const { seafoodId } = req.params;

  seafoodRef
    .doc(seafoodId)
    .get()
    .then((seafoodFound) => {
      res.send(seafoodFound.data());
    });
});

app.get("/", (req, res) => {
  const db = getFirestore();
  res.send("API Works!!");
});

app.listen(3000, () => {
  console.log("API listening on port 3000");
});
