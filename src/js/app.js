import firebase from 'firebase/app';
import 'firebase/database';
import './components/chat-app'

let firebaseConfig = {
  apiKey: "AIzaSyB31nz4hfCt1BzK78bc7Y8GMS0PKXDCn7w",
  authDomain: "iw3-firebase.firebaseapp.com",
  databaseURL: "https://iw3-firebase.firebaseio.com",
  projectId: "iw3-firebase",
  storageBucket: "iw3-firebase.appspot.com",
  messagingSenderId: "317222753167",
  appId: "1:317222753167:web:1c7745b5a5489eb1"
};
let firebaseConfigInterv = {
  apiKey: "AIzaSyAH0oncQi3cXnqxpwI4pHtqsTDCooqroRc",
  authDomain: "my-project-bf769.firebaseapp.com",
  databaseURL: "https://my-project-bf769.firebaseio.com",
  projectId: "my-project-bf769",
  storageBucket: "my-project-bf769.appspot.com",
  messagingSenderId: "975375538780",
  appId: "1:975375538780:web:ca0f8aefd0fbc653"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');

  // Persist data if not exist
  database.ref().child('users').push({
    emai: input.value
  });
});

database.ref('users/').on('child_added', (data) => {
  console.log(data.val())
});

function getRef(path) { return database.ref() }