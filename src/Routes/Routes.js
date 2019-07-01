const express = require('express');
const routes = express.Router();
const registerController = require('../controllers/registerControler')

const auth = require('../controllers/auth');

routes.get('/', auth, (req, res) => {
    // console.log(res.locals.auth_data)
    return res.send({ message: 'Hackerman!' });
})

routes.get('/list', auth, registerController.list);
routes.post('/register', registerController.register);
routes.post('/login', registerController.login);
routes.put('/edit', registerController.edit);
routes.delete('/delete', registerController.delete)
module.exports = routes;
