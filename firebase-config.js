// firebase-config.js
// ATENÇÃO: Substitua as chaves abaixo pelas do seu projeto no Firebase Console.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "COLE_AQUI_A_SUA_API_KEY",
    authDomain: "COLE_AQUI_O_SEU_AUTH_DOMAIN",
    projectId: "COLE_AQUI_O_SEU_PROJECT_ID",
    storageBucket: "COLE_AQUI_O_SEU_STORAGE_BUCKET",
    messagingSenderId: "COLE_AQUI_O_SEU_MESSAGING_SENDER_ID",
    appId: "COLE_AQUI_O_SEU_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
