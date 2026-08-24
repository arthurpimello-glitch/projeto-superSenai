/* index */
/* LÓGICA DO CADASTRO */
import { auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Seleciona o formulário
const btCadastrar = document.getElementById("btnCadastrar");

// Escuta o envio do formulário
if (btCadastrar){
btCadastrar.addEventListener('click', async () => {
  
  // Pega os valores digitados nos inputs
  const nome = document.getElementById('usuarioCadastro').value;
  const email = document.getElementById('emailCadastro').value;
  const senha = document.getElementById('senhaCadastro').value;

  // Validação simples de tamanho de senha
  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  try {
    // 1. Cria a conta no Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // 2. Salva o nome do usuário no perfil dele
    await updateProfile(user, {
      displayName: nome
    });

    alert(`Conta criada com sucesso! Bem-vindo(a), ${nome}`);
    
    // 3. Redireciona para a página principal (ajuste o nome do arquivo se necessário)
    window.location.href = "/html/pagInicial.html";

  } catch (error) {
    console.error("Erro no cadastro:", error);

    // Mensagens amigáveis para erros do Firebase
    switch (error.code) {
      case 'auth/email-already-in-use':
        alert("Este e-mail já está cadastrado.");
        break;
      case 'auth/invalid-email':
        alert("E-mail inválido.");
        break;
      case 'auth/weak-password':
        alert("Senha muito fraca.");
        break;
      default:
        alert("Erro ao realizar cadastro: " + error.message);
    }
  }
});
}

/* LÓGICA DO LOGIN */
const botaoLogin = document.getElementById('btnLogin');

// A verificação 'if' evita erros se o script rodar em páginas que não têm esse botão
if (botaoLogin) {
  botaoLogin.addEventListener('click', async () => {
    // 1. Pega os valores digitados nos inputs da tela de login
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    // 2. Valida se os campos não estão vazios
    if (!email || !senha) {
      alert("Por favor, preencha o e-mail e a senha.");
      return;
    }

    try {
      // 3. Autentica o usuário no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      console.log("Usuário logado:", user);
      alert(`Bem-vindo(a) de volta!`);

      // 4. Redireciona para a página principal 
      window.location.href = "/html/pagInicial.html";

    } catch (error) {
      console.error("Erro ao fazer login:", error.code);

      // Tratamento amigável para os erros comuns de login
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          alert("E-mail ou senha incorretos.");
          break;
        case 'auth/invalid-email':
          alert("Formato de e-mail inválido.");
          break;
        default:
          alert("Erro ao entrar: " + error.message);
      }
    }
  });
}

/* avlUsuarios / pagInicial */
/* Parte relativa ao menu suspenso da troca de telas */
const BtnMenu = document.getElementById("btnMenu");
const menuLinks = document.getElementById("menuLinks");

// Alterna a visibilidade ao clicar no botão
if (BtnMenu){
BtnMenu.addEventListener('click', (event) => {
  event.stopPropagation();
  menuLinks.classList.toggle('show');
});

// Fecha o menu se clicar em qualquer outro lugar da tela
document.addEventListener('click', () => {
  menuLinks.classList.remove('show');
});
}

import { onAuthStateChanged } from "./firebaseConfig.js";

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
