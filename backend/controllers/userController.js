const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { email, password, rol, lenguage } = req.body;
  
  try {
    const checkEmailExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (checkEmailExists.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hashedPassword, rol, lenguage]
    );

   
    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener los detalles del usuario
const getUser = async (req, res) => {
  console.log("holas 1234 ", req.user)
  const { email } = req.user;  
  
  try {
    
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log("holaaa2222", result.rows)
    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUser };
