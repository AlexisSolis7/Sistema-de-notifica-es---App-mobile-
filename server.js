const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const Usuario = require("./models/Usuario");

const webpush = require("web-push");
const chaves = require("./chaves.json");
const app = express();

webpush.setVapidDetails(
    "mailto:alexissolis396@gmail.com",
    chaves.publicKey,
    chaves.privateKey
);

app.use(express.json());
app.use(cors());
app.use(express.static("public"));


const urlMongo = "mongodb://localhost:27017";
const nomeBanco = "AppNoticias";
let db;
let colecaoUsuarios;

// POST para registrar os usuarios
app.post("/api/registrar", async function (req, res) {
    try {
        const { id, categorias, subscription } = req.body;

        console.log("Recebendo registro de usuário:", id);

        // Guardei no model que eu criei antes
        const resultado = await Usuario.salvar(colecaoUsuarios, id, categorias, subscription);

        if (resultado.upsertedCount > 0) {
            console.log("Novo usuário registrado:", id);
        } else {
            console.log("Usuário atualizado:", id);
        }

        res.json({ sucesso: true, mensagem: "Usuário registrado com sucesso" });
    } catch (erro) {
        console.log("Erro ao registrar usuário:", erro);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao registrar" });
    }
});




// POST que vai enviar as notificaçoes - ADMIN :3
app.post("/api/admin/publicar", async function (req, res) {
    try {
        const { categoria, conteudo } = req.body;

        console.log("Enviando notificação para categoria:", categoria);

        // Aqeui ele ve os usuarios que tem a mesma categoria
        const usuarios = await colecaoUsuarios.find({
            categorias: categoria
        }).toArray();

        console.log("Usuários encontrados:", usuarios.length);

        // Preparar o payload da notificação
        const payload = JSON.stringify({
            title: "Notícia: " + categoria,
            body: conteudo
        });

        // Enviar noti para cada usuário
        let enviados = 0;
        let erros = 0;

        for (const usuario of usuarios) {
            try {
                await webpush.sendNotification(usuario.subscription, payload);
                enviados++;
                console.log("Notificação enviada para:", usuario.id);
            } catch (erro) {
                erros++;
                console.log("Erro ao enviar para", usuario.id, ":", erro.message);
            }
        }

        res.json({
            sucesso: true,
            mensagem: `Notificações enviadas: ${enviados} sucesso, ${erros} erros`
        });
    } catch (erro) {
        console.log("Erro ao publicar notificação:", erro);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao publicar" });
    }
});




async function init() {
    try {
        const cliente = new MongoClient(urlMongo);
        await cliente.connect();
        console.log("Conectado ao Mongo");

        db = cliente.db(nomeBanco);
        colecaoUsuarios = db.collection("usuarios");
        console.log("Usando banco:", nomeBanco);

        app.listen(4500, function () {
            console.log("Servidor rodando na porta 4500");
        });
    } catch (erro) {
        console.log("Erro ao conectar no MongoDB:", erro);
    }
}

init();
