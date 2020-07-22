// imports
const functions = require('firebase-functions');
const { db } = require('./util/admin');
const app = require('express')();
const FBAuth = require('./util/fbAuth');
const cors = require('cors');
app.use(cors());

const {
	getAllScreams,
	postOneScream,
	getScream,
	commentOnScream,
	likeScream,
	unlikeScream,
	deleteScream
} = require('./handlers/screams');
const {
	signup,
	login,
	uploadImage,
	addUserDetails,
	getAuthenticatedUser,
	getUserDetails,
	markNotificationsRead
} = require('./handlers/users');

// screams routes
app.get('/screams', getAllScreams);
app.get('/scream/:screamId', getScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream', FBAuth, postOneScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);

//exports
exports.api = functions.https.onRequest(app);

// create notification for like
exports.createNotificationOnLike = functions.firestore
	.document('likes/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/screams/${snapshot.data().screamId}`)
			.get()
			.then((doc) => {
				if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recepient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'like',
						read: false,
						screamId: doc.id
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	});

//delete notification for unlike
exports.deleteNotificationOnUnLike = functions.firestore
	.document('likes/{id}')
	.onDelete((snapshot) => {
		return db
			.doc(`/notifications/${snapshot.id}`)
			.delete()
			.catch((err) => {
				console.error(err);
			});
	});

// create notification for comment
exports.createNotificationOnComment = functions.firestore
	.document('comments/{id}')
	.onCreate((snapshot) => {
		return db
			.doc(`/screams/${snapshot.data().screamId}`)
			.get()
			.then((doc) => {
				if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
					return db.doc(`/notifications/${snapshot.id}`).set({
						createdAt: new Date().toISOString(),
						recepient: doc.data().userHandle,
						sender: snapshot.data().userHandle,
						type: 'comment',
						read: false,
						screamId: doc.id
					});
				}
			})
			.catch((err) => {
				console.error(err);
			});
	});

// update image in scream
exports.onUserImageChange = functions.firestore
	.document('/users/{userId}')
	.onUpdate((change) => {
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			console.log('image has changed');
			const batch = db.batch();

			return db
				.collection('screams')
				.where('userHandle', '==', change.before.data().handle)
				.get()
				.then((data) => {
					data.forEach((doc) => {
						const scream = db.doc(`/screams/${doc.id}`);
						batch.update(scream, { userImage: change.after.data().imageUrl });
					});
					return batch.commit();
				});
		} else return true;
	});

// on deletion of a scream
exports.onScreamDelete = functions.firestore
	.document('/screams/{screamId}')
	.onDelete((snapshot, context) => {
		const screamId = context.params.screamId;
		const batch = db.batch();
		return db
			.collection('comments')
			.where('screamId', '==', screamId)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/comments/${doc.id}`));
				});
				return db.collection('likes').where('screamId', '==', screamId).get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/likes/${doc.id}`));
				});
				return db
					.collection('notifications')
					.where('screamId', '==', screamId)
					.get();
			})
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/notifications/${doc.id}`));
				});
				return batch.commit();
			})
			.catch((err) => {
				console.error(err);
				return res.status(500).json({ error: err.code });
			});
	});
