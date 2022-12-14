const jwt = require("jsonwebtoken");
const User = require("../Models/User.model.js");
const express = require("express");


async function protect(req, res, next) {
  
  
  try {
    token = req.headers['authorization'].split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    req.user = await User.findById(decoded.id)
    
  
    next();
  } catch (err) {
    res.json("erro no token") ;
  }
}

module.exports = { protect };


