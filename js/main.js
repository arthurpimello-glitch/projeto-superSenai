/* index */
/* LÓGICA DO CADASTRO */
import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
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
    window.location.href = "./html/pagInicial.html";

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

/* pagInicial */
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

// Variável para guardar o tipo selecionado (padrão 'filme')
let tipoSelecionado = 'filme';

// Seleciona os botões de categoria
const btnsCategoria = document.querySelectorAll('.btn-categoria');

btnsCategoria.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove o estilo ativo de todos e adiciona no clicado
    btnsCategoria.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Pega o valor do atributo 'data-type' (filme ou serie)
    tipoSelecionado = btn.getAttribute('data-type');
  });
});

// Evento do botão Salvar
const btnSalvarReview = document.getElementById('btnSalvarReview');

if (btnSalvarReview) {
  btnSalvarReview.addEventListener('click', async () => {
    const usuarioLogado = auth.currentUser;

    if (!usuarioLogado) {
      alert("Você precisa estar logado para enviar uma avaliação!");
      return;
    }

    const nomeTitulo = document.getElementById('nomeFilme').value;
    const nota = Number(document.getElementById('notaFilme').value);
    const assistiriaDeNovo = document.getElementById('assistiriaDeNovo').checked;
    const comentario = document.getElementById('comentarioFilme').value;

    if (!nomeTitulo || !nota || !comentario) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        userId: usuarioLogado.uid,
        userName: usuarioLogado.displayName || usuarioLogado.email,
        tipo: tipoSelecionado, // <--- Salva se é "filme" ou "serie"
        nomeTitulo: nomeTitulo,
        nota: nota,
        assistiriaDeNovo: assistiriaDeNovo,
        comentario: comentario,
        criadoEm: serverTimestamp()
      });

      alert("Avaliação publicada com sucesso!");
      
      // Limpa os campos
      document.getElementById('nomeFilme').value = '';
      document.getElementById('comentarioFilme').value = '';

    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      alert("Erro ao salvar: " + error.message);
    }
  });
}

const listaReviews = document.getElementById('listaReviews');

// 1. Monitora o estado de autenticação para carregar as reviews do usuário
onAuthStateChanged(auth, (usuario) => {
  if (usuario) {
    carregarReviewsDoUsuario(usuario.uid);
  } else {
    if (listaReviews) {
      listaReviews.innerHTML = '<p class="mensagem-vazio">Faça login para ver suas avaliações.</p>';
    }
  }
});

// 2. Função que escuta as mudanças no Firestore em tempo real
function carregarReviewsDoUsuario(userId) {
  if (!listaReviews) return;

  // Consulta: filtra pela coleção 'reviews' onde userId é o do usuário atual, ordenando do mais recente para o mais antigo
  const q = query(
    collection(db, "reviews"),
    where("userId", "==", userId),
    orderBy("criadoEm", "desc")
  );

  // O onSnapshot atualiza a tela automaticamente sempre que um dado muda/adiciona
  onSnapshot(q, (snapshot) => {
    listaReviews.innerHTML = ''; // Limpa a lista antes de renderizar

    if (snapshot.empty) {
      listaReviews.innerHTML = '<p class="mensagem-vazio">Você ainda não fez nenhuma avaliação.</p>';
      return;
    }

    snapshot.forEach((doc) => {
      const review = doc.data();
      
      // Cria a estrutura HTML do card
      const card = document.createElement('div');
      card.classList.add('card-review');

      const tipoClasse = review.tipo === 'serie' ? 'badge-serie' : 'badge-filme';
      const tipoTexto = review.tipo === 'serie' ? 'Série' : 'Filme';
      const novoTexto = review.assistiriaDeNovo ? 'Sim' : 'Não';

      card.innerHTML = `
        <div class="header-card">
          <span class="titulo-card">${review.nomeTitulo}</span>
          <span class="badge-tipo ${tipoClasse}">${tipoTexto}</span>
        </div>
        <div class="info-card">
          <span>Nota: <strong class="nota-destaque">${review.nota}/10</strong></span>
          <span>Assistiria de novo: <strong>${novoTexto}</strong></span>
        </div>
        <p class="comentario-card">${review.comentario}</p>
      `;

      listaReviews.appendChild(card);
    });
  }, (error) => {
    console.error("Erro ao buscar avaliações:", error);
    listaReviews.innerHTML = '<p class="mensagem-vazio">Erro ao carregar avaliações.</p>';
  });
}

/* avlUsuários */
const feedFilmes = document.getElementById('feedFilmes');
const feedSeries = document.getElementById('feedSeries');

// Função para renderizar os cards em um container específico
function escutarFeed(tipo, elementoContainer) {
  if (!elementoContainer) return;

  // Consulta todas as reviews do tipo especificado, ordenando pelas mais recentes
  const q = query(
    collection(db, "reviews"),
    where("tipo", "==", tipo),
    orderBy("criadoEm", "desc")
  );

  onSnapshot(q, (snapshot) => {
    elementoContainer.innerHTML = '';

    if (snapshot.empty) {
      elementoContainer.innerHTML = `<p class="mensagem-vazio">Nenhum(a) ${tipo} avaliado(a) ainda.</p>`;
      return;
    }

    snapshot.forEach((doc) => {
      const review = doc.data();

      const card = document.createElement('div');
      card.classList.add('card-feed', tipo);

      const novoTexto = review.assistiriaDeNovo ? 'Sim' : 'Não';
      // Exibe o nome do autor ou 'Anônimo' se não preenchido
      const autor = review.userName || 'Usuário Anônimo';

      card.innerHTML = `
        <div class="autor-info">Avaliado por: ${autor}</div>
        <div class="titulo-feed">${review.nomeTitulo}</div>
        <div class="detalhes-feed">
          <span>Nota: <strong style="color: #f1c40f;">${review.nota}/10</strong></span>
          <span>Assistiria de novo: <strong>${novoTexto}</strong></span>
        </div>
        <p class="comentario-feed">${review.comentario}</p>
      `;

      elementoContainer.appendChild(card);
    });
  }, (error) => {
    console.error(`Erro ao buscar ${tipo}s:`, error);
    elementoContainer.innerHTML = `<p class="mensagem-vazio">Erro ao carregar dados.</p>`;
  });
}

// Inicializa a escuta para Filmes e Séries
escutarFeed('filme', feedFilmes);
escutarFeed('serie', feedSeries);