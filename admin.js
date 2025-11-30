
// Capturar argumentos da linha de comando
const categoria = process.argv[2];
const conteudo = process.argv[3];

if (!categoria || !conteudo) {
    console.log("Erro: Argumentos insuficientes!");
    console.log("Uso: node admin.js <categoria> <conteudo>");
    console.log('Exemplo: node admin.js tecnologia "Nova atualização"');
    process.exit(1);
}

console.log("Enviando notificação...");
console.log("Categoria:", categoria);
console.log("Conteúdo:", conteudo);

// Fazer requisição POST para a API
fetch("http://localhost:4500/api/admin/publicar", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        categoria: categoria,
        conteudo: conteudo
    })
})
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            console.log(" Sucesso:", data.mensagem);
        } else {
            console.log(" Erro:", data.mensagem);
        }
    })
    .catch(erro => {
        console.log(" Erro ao conectar com o servidor:", erro.message);
        console.log("Certifique-se de que o servidor está rodando (node server.js)");
    });
