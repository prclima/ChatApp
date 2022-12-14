const User = require("../Models/User.model.js");
const generateToken = require("../Config/generateToken.js");
const bcrypt = require('bcrypt');
const user = require("../Models/User.model.js");

async function registerUser(req, res) {
  
  try {
    const { name, email, password } = req.body;

    //Verificar se o usuário já está cadastrado
    const existUser = await User.findOne({ email: email })
    if (existUser) {
      return res.status(400).json("Usuário já cadastrado");
    }

    //Criar o hash da senha
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword =  await bcrypt.hash(password, salt)
    const createdUser = await User.create({
      ...req.body,
      passwordHash: hashedPassword,
     
    });
      return res.status(201).json(createdUser)
  } catch (err) {
    return res.status(500).json(err);
  }

}

async function authUser(req, res) {
    try {
        const { email, password } = req.body;
      // Tentar achar o email cadastrado
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: "Email ou senha invalidos" });
        }
        // Conferir se a senha está valida
        if (!(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(404).json({ msg: "Email ou senha invalidos" });
          }
          const token = generateToken(user._id)

    return res.status(200).json({
        name: user.name,
        email: user.email,
        _id: user._id, 
        token: token, 
    });
  } catch (err) {
    console.log(err);
  }

}

// buscar usuário 
async function allUsers(req, res) {
  
  try{
  const userSearch = req.query.search ? 
  { $or: 
    [
    {name: {$regex: req.query.search, $options:"i"} },
    {email: {$regex: req.query.search, $options:"i"} },
  ],
  }
  : {};
  const users = await User.find(userSearch)
  
    res.status(200).json(users) 
    console.log("buscou")
    
  } catch(err){
    console.log("deu erro")
  }
  }


module.exports = { registerUser, authUser, allUsers}
