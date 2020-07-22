//import
const admin = require('firebase-admin');

//initialize
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL: 'https://socialape-1f5dd.firebaseio.com',
	storageBucket: 'socialape-1f5dd.appspot.com'
});

const db = admin.firestore();

//export
module.exports = { admin, db };
