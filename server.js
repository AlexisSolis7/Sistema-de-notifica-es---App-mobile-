const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const Usuario = require("./models/Usuario");
const app = express();


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

async function init() {
    try {
        // Conexao com o Mongo
        const cliente = new MongoClient(urlMongo);
        await cliente.connect();
        console.log("Conectado ao Mongo");

        db = cliente.db(nomeBanco);
        colecaoUsuarios = db.collection("usuarios");
        console.log("Usando banco:", nomeBanco);

        // Iniciar servidor Express
        app.listen(4500, function () {
            console.log("Servidor rodando na porta 4500");
        });
    } catch (erro) {
        console.log("Erro ao conectar no MongoDB:", erro);
    }
}

init();
