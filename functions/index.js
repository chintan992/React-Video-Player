const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.signup = functions.https.onRequest(async (req, res) => {
  const {email, password} = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    res.status(201).send({uid: userRecord.uid});
  } catch (error) {
    res.status(400).send({error: error.message});
  }
});
