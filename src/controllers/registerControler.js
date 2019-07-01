const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/user');
const config = require('../config/config');

const createUserToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt_pass, { expiresIn: config.jwt_expires_in });
}

module.exports = {
    async list(req, res) {
        try {
            const users = await Users.find({});
            return res.send(users);

        } catch (error) {
            return res.status(400).send({ error: 'Opa, parece que deu ruim no servidor!' });
        }
    },

    async register(req, res) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.status(400).send({ error: 'Opa, parece que você esqueceu algum campo vaziu!' });
        if (name.length < 3) return res.status(400).send({ error: 'Opa, o nome precisa ser maior que 3 caracteres' })
        try {
            if (await Users.findOne({ email })) return res.status(400).send({ error: 'Opa, parece que você está tentando cadastrar um email já registrado!' });

            const user = await Users.create(req.body);

            user.password = undefined;
            return res.status(201).send({ user, token: createUserToken(user._id) });

        } catch (error) {
            return res.status(500).send({ error: 'Erro ao buscar usuario!' });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ error: 'Opa, parece que você esqueceu algum campo vaziu :/' });

        try {
            const user = await Users.findOne({ email }).select('+password');

            if (!user) return res.status(400).send({ error: 'Opa, parece que esse usuario não está registrado!' });

            const pass_ok = await bcrypt.compare(password, user.password);

            if (!pass_ok) return res.status(401).send({ error: 'Opa! parece que você está inserindo algum dado invalido :v' });

            user.password = undefined;
            return res.send({ user, token: createUserToken(user._id) });

        } catch (error) {
            return res.status(500).send({ error: 'DEU RUIM! deu ruim no servidor!' });
        }
    },
    async edit(req, res) {
        const { id, name, email, password } = req.body;

        const setState = { name, email, password, }

        if (!name || !email || !password) return res.status(400).send({ error: 'Opa, parece que você esqueceu algum campo vaziu!' });
        setState.password = await bcrypt.hash(password, 10);

        await Users.updateOne({ _id: id }, setState, function (err, doc) {
            if (err) {
                res.status(400).send('Opa, parece que esse registro não existe :/');
            }
        });

        return res.send(await Users.findOne({ _id: id }));
    },
    async delete(req, res) {

        const { id } = req.body;
        if (!id) res.status(400).send({ error: 'Opa, o id do documento a ser excluido deve ser passado!' });

        try {
            await Users.deleteOne({ _id: id });
            res.send({ message: 'Documento deletado com sucesso!' });

        } catch (error) {
            res.status(400).send({ error: 'Não consegui encontrar registro requerido, tente novamente com um id valido :/!' });

        }

    }
}