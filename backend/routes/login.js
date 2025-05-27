const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /login
router.post('/', authController.login);
router.post('/', authController.googleLogin);

module.exports = router;
