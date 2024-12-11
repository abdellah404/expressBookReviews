const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  if (typeof(username) === String) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const registred = users.filter(user => user.username === username && user.password === password );
  if (registred){
    return true;
  }
  return false;

};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  user = req.body; 
   if(!user){
    return res.status(404).json({ message: "Body Empty" });
  }
  if(authenticatedUser(user.username , user.password )){
    return res.status(200).json({ message: "Loged in successfully" });
  }
  else {return res.status(300).json({ message: "please register first" });}
  
  let accessToken = jwt.sign({data : user} ,'access', {expiresIn: 60 * 60});
  req.session.authorization = {
    accessToken
  };

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

