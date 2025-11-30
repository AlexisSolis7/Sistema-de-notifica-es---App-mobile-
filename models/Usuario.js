class Usuario {
    constructor(id, categorias, subscription) {
        this.id = id;
        this.categorias = categorias;
        this.subscription = subscription;
        this.dataRegistro = new Date();
    }

    // Método para salvar ou atualizar o usuário
    static async salvar(colecao, id, categorias, subscription) {
        const usuario = new Usuario(id, categorias, subscription);

        const resultado = await colecao.updateOne(
            { id: id },
            {
                $set: {
                    id: usuario.id,
                    categorias: usuario.categorias,
                    subscription: usuario.subscription,
                    dataRegistro: usuario.dataRegistro
                }
            },
            { upsert: true }
        );

        return resultado;
    }

    // Método para buscar usuário por ID
    static async buscarPorId(colecao, id) {
        return await colecao.findOne({ id: id });
    }

    // Método para buscar todos os usuários
    static async buscarTodos(colecao) {
        return await colecao.find({}).toArray();
    }
}

module.exports = Usuario;
