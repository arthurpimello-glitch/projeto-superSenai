/* Parte relativa ao menu suspenso da troca de telas */
const BtnMenu = document.getElementById("btnMenu");
const menuLinks = document.getElementById("menuLinks");

// Alterna a visibilidade ao clicar no botão
BtnMenu.addEventListener('click', (event) => {
  event.stopPropagation();
  menuLinks.classList.toggle('show');
});

// Fecha o menu se clicar em qualquer outro lugar da tela
document.addEventListener('click', () => {
  menuLinks.classList.remove('show');
});

/*
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const userAvatar = document.getElementById('userAvatar');

// Lista de cores sólidas agradáveis (estilo Google)
const avatarColors = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
  '#3F51B5', '#2196F3', '#009688', '#4CAF50', 
  '#FF9800', '#FF5722', '#795548', '#607D8B'
];

// Função para escolher sempre a mesma cor com base em um texto (ex: UID do Firebase)
function getColorFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

// Monitora o estado da autenticação do Firebase
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Pega o nome do Firebase (displayName) ou usa a primeira letra do e-mail
    const name = user.displayName || user.email || 'U';
    const initialLetter = name.charAt(0).toUpperCase();

    // Define a letra inicial no centro
    userAvatar.textContent = initialLetter;

    // Define a cor fixa baseada no UID do usuário
    userAvatar.style.backgroundColor = getColorFromId(user.uid);
  } else {
    // Caso o usuário não esteja logado
    userAvatar.textContent = '?';
    userAvatar.style.backgroundColor = '#757575';
  }
});
*/