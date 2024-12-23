const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/userController'); 
const { authenticateToken } = require('../middlewares/authMiddleware'); 
const router = express.Router();

//registrar un nuevo usuario
router.post('/register', registerUser);  

// iniciar sesión 
router.post('/login', loginUser);  

//obtener los datos del usuario autenticado
router.get('/profile', authenticateToken, getUser);  
 
module.exports = router;
