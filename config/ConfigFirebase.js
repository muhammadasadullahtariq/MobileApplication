import Firebase from "firebase";

var config = {
  apiKey: "AIzaSyAF-RkMDeSHtRLVDuGGc4WLUOF4Ru_nzr0",
  authDomain: "eatt-live.firebaseapp.com",
  databaseURL: "https://eatt-live.firebaseio.com",
  projectId: "eatt-live",
  storageBucket: "eatt-live.appspot.com",
  messagingSenderId: "321895915269",
  appId: "1:321895915269:web:333eef988fde598132216c",
  measurementId: "G-Q6ZLB78570",
};
let app = Firebase.initializeApp(config);
export const fb = app.database();
