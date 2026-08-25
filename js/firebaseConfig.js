// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5h17LfCbiZiP0PRRDhAFDzh09wGrp7p8",
  authDomain: "bananas-assassinas.firebaseapp.com",
  databaseURL: "https://bananas-assassinas-default-rtdb.firebaseio.com",
  projectId: "bananas-assassinas",
  storageBucket: "bananas-assassinas.firebasestorage.app",
  messagingSenderId: "728416141159",
  appId: "1:728416141159:web:5ea582b81fb23f191e39c2"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

// Exporta apenas o banco de dados
export const db = getFirestore(app);

export const auth = getAuth(app);
export { onAuthStateChanged };