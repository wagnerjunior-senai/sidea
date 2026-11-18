
/* ======================================
   CONFIGURAÇÃO DO BOT-VINNY - SIDE A
====================================== */

const MODELO = "gpt-5.4-nano";

const INSTRUCAO_SISTEMA = `
Você é um chatbot da empresa SIDE A.
Seu nome é bot-Vinny.

Sua função é auxiliar com dúvidas referentes à loja
de discos de vinil e colecionáveis de Rock, Pop e K-Pop,
com uma identidade visual moderna e nostálgica,
usando preto carvão, creme e bordô.

Responda sempre em no máximo 20 tokens.
Se a resposta precisar ser maior, faça um resumo objetivo.

Para perguntas que não sejam do contexto de saudação
ou fora do contexto de loja de discos de vinil e
colecionáveis de Rock, Pop e K-Pop, você deverá responder:

"Estou configurado com a função de auxiliar no contexto
de loja de discos de vinil e colecionáveis de Rock, Pop
e K-Pop. Esta pergunta foge do meu contexto".
`;

/* ======================================
   ELEMENTOS HTML
====================================== */

const apiKey = document.getElementById("apiKey");
const mensagem = document.getElementById("mensagem");
const conversa = document.getElementById("conversa");
const chatForm = document.getElementById("chatForm");
const botaoEnviar = document.getElementById("botaoEnviar");
const aviso = document.getElementById("aviso");
const limparConversa = document.getElementById("limparConversa");

/* ======================================
   HISTÓRICO DA CONVERSA
====================================== */

let historico = [];

/* ======================================
   MOSTRAR MENSAGENS NA TELA
====================================== */

function mostrarMensagem(remetente, texto, tipo) {

    const novaMensagem = document.createElement("div");

    novaMensagem.classList.add("mensagem", tipo);

    const nome = document.createElement("strong");
    nome.textContent = remetente + ":";

    const conteudo = document.createElement("span");
    conteudo.textContent = texto;

    novaMensagem.appendChild(nome);
    novaMensagem.appendChild(conteudo);

    conversa.appendChild(novaMensagem);

    conversa.scrollTop = conversa.scrollHeight;
}

/* ======================================
   ENVIAR MENSAGEM PARA O CHATGPT
====================================== */

chatForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const chave = apiKey.value.trim();
    const textoUsuario = mensagem.value.trim();

    /* VERIFICAR CHAVE */

    if (chave === "") {
        aviso.textContent = "Digite sua chave da API OpenAI.";
        apiKey.focus();
        return;
    }

    /* VERIFICAR MENSAGEM */

    if (textoUsuario === "") {
        aviso.textContent = "Digite uma mensagem antes de enviar.";
        mensagem.focus();
        return;
    }

    /* MOSTRAR MENSAGEM DO USUÁRIO */

    mostrarMensagem("Você", textoUsuario, "usuario");

    /* ADICIONAR AO HISTÓRICO */

    historico.push({
        role: "user",
        content: textoUsuario
    });

    mensagem.value = "";

    aviso.textContent = "Vinny está pensando...";

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "AGUARDE...";

    try {

        /* REQUISIÇÃO PARA A API OPENAI */

        const resposta = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + chave
                },

                body: JSON.stringify({

                    model: MODELO,

                    messages: [
                        {
                            role: "system",
                            content: INSTRUCAO_SISTEMA
                        },
                        ...historico
                    ],

                    temperature: 0.3,

                    max_completion_tokens: 20,

                    reasoning_effort: "none"

                })
            }
        );

        const dados = await resposta.json();

        /* VERIFICAR ERROS DA API */

        if (!resposta.ok) {

            const erro =
                dados.error?.message ||
                "Não foi possível acessar a API.";

            throw new Error(erro);
        }

        /* PEGAR RESPOSTA DO CHATGPT */

        const respostaBot =
            dados.choices?.[0]?.message?.content?.trim();

        if (!respostaBot) {
            throw new Error("A API não retornou uma resposta.");
        }

        /* MOSTRAR RESPOSTA */

        mostrarMensagem("Vinny", respostaBot, "bot");

        /* SALVAR RESPOSTA NO HISTÓRICO */

        historico.push({
            role: "assistant",
            content: respostaBot
        });

        aviso.textContent = "Resposta recebida com sucesso!";

    } catch (erro) {

        console.error("Erro:", erro);

        mostrarMensagem(
            "Vinny",
            "Não consegui responder. Verifique a chave e tente novamente.",
            "bot"
        );

        aviso.textContent = "Erro: " + erro.message;

        /* RETIRAR A MENSAGEM QUE FALHOU DO HISTÓRICO */

        historico.pop();

    } finally {

        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "ENVIAR MENSAGEM";

        mensagem.focus();

    }

});

/* ======================================
   LIMPAR CONVERSA
====================================== */

limparConversa.addEventListener("click", function() {

    historico = [];

    conversa.innerHTML = "";

    mostrarMensagem(
        "Vinny",
        "Olá! Como posso ajudar você hoje? 🎵",
        "bot"
    );

    aviso.textContent = "Conversa reiniciada.";

});

/* ======================================
   ENVIAR COM ENTER
====================================== */

mensagem.addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        chatForm.requestSubmit();

    }

});
