// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, set, get, ref, child, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { updateData } from '/JS/index.js';

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
    databaseURL: "https://snake-game-ca8d0-default-rtdb.firebaseio.com/",
    storageBucket: "snake-game-ca8d0.firebasestorage.app",
    messagingSenderId: "1033008392792",
    appId: "1:1033008392792:web:b6c941ef64db6cc88a382d",
    measurementId: "G-9PETE2Y0JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app)

export function createData(score, name) {
    set(ref(db, 'GameScore/'), {
        HighScore: score,
        user: name
    })
}

export let highscore;
export let playerscore;
export let games;

const register = document.querySelector(".register")

async function signup(email, password, username) {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user details in the database
        await set(ref(db, `users/${user.uid}`), {
            username: username,
            email: email,
            score: 0,
            games: 0
        });
         updateData()
        alert('Signup successful!');
    } catch (error) {
        console.error('Error during signup:', error.message);
        alert(error.message);
    }
}

async function login(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
    } catch (error) {
        console.error('Error during login:', error.message);
        alert(error.message);
    }
}


signupbtn.addEventListener('click', (event) => {
    event.preventDefault()
    signup(signEmail.value, signpassword.value, username.value);
})
loginbtn.addEventListener('click', (event) => {
    event.preventDefault()
    login(loginEmail.value, loginpassword.value);
})

let userid;
onAuthStateChanged(auth, (user) => {
    if (user) {
        register.style.display = 'none'
        loader.style.display = 'block';
        userid = user.uid
        // Fetch user details from Realtime Database
        updateData()
    } else {
        register.style.display = 'flex'
    }
});

export function readData() {
    const dataref = ref(db, 'GameScore');
    const playerdata = ref(db, 'users');
    get(dataref).then((snapshot) => {
        let data = snapshot.val()
        document.getElementById('Username').innerHTML = data['user']
        document.getElementById('UserScore').innerHTML = data['HighScore']
        highscore = data['HighScore']
    })
    get(playerdata).then((snapshot) => {
        let data = snapshot.val()
        playerscore = data[userid]['score']
        bestsbar.innerHTML = 'Best Score:' + playerscore
        games = data[userid]['games']
    })
}

export async function fetchData() {
    try {
        const snapshot = await get(child(ref(db), `users/${userid}`));
        if (snapshot.exists()) {
            return snapshot.val(); // Explicitly return the data
        } else {
            console.log('No user data found!');
            return null; // Return null if no data exists
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw the error if needed
    }
}


export function updateBestScore(val) {
    const updated = {
        ['score']: val
    };

    update(ref(db, `users/${userid}`), updated)
}

export function updateGames(val) {
    const updated = {
        ['games']: val
    };

    update(ref(db, `users/${userid}`), updated)
}

let rankbord = document.querySelector('.ranks')
let players = []

export function rankings() {
    const rankref = ref(db, 'users')
    get(rankref).then((snapshot) => {
        let ranks = snapshot.val()
        for (const key in ranks) {
            players.push(ranks[key])
        }
        players.sort((a,b) => b.score - a.score)
        players.forEach((player,index) =>{
            let rank = document.createElement('div')
            rank.classList.add('headings')
            rank.innerHTML = `<h4>${index +1}</h4> <h4>${player.username}</h4> <h4>${player.score}</h4>`
            rankbord.appendChild(rank)
        })
    })
}