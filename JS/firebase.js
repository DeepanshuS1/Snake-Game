// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, set, get, ref } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey1 = 'AIzaSyAM789e6i6g'
const apiKey2 = 'uC8FGq5gvE9mo9MDQC8xDLg'

const firebaseConfig = {
    apiKey: apiKey1 + apiKey2,
    authDomain: "snake-game-ca8d0.firebaseapp.com",
    projectId: "snake-game-ca8d0",
    storageBucket: "snake-game-ca8d0.firebasestorage.app",
    messagingSenderId: "1033008392792",
    appId: "1:1033008392792:web:b6c941ef64db6cc88a382d",
    measurementId: "G-9PETE2Y0JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export function createData(score, name) {
    set(ref(db, 'GameScore/'), {
        HighScore: score,
        user: name
    })
}

export let highscore;

export function readData() {
    const dataref = ref(db, 'GameScore');
    get(dataref).then((snapshot) => {
        let data = snapshot.val()
        document.getElementById('Username').innerHTML = data['user']
        document.getElementById('UserScore').innerHTML = data['HighScore']
        highscore = data['HighScore']
    })
}
