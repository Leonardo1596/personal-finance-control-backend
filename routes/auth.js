const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');


router.post('/auth/sign-up', AuthController.register);
router.post('/auth/sign-in', AuthController.login);

module.exports = router;