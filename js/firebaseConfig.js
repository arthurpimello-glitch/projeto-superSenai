// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// Configuração do Firebase


// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exporta apenas o banco de dados
export { database };
