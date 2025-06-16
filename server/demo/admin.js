const admin = require("firebase-admin");
const serviceAccount = require('../sample-6f14d-firebase-adminsdk-fbsvc-0d9debca9b.json'); // 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;