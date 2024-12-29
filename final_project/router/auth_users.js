const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  if (typeof username === String) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const registred = users.filter(
    (user) => user.username === username && user.password === password
  );
  if (registred != undefined) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const user = req.body;
  if (!user) {
    return res.status(404).json({ message: "Body Empty" });
  }

  let accessToken = jwt.sign({ username: user.username }, "access", {
    expiresIn: 60 * 60,
  });
  req.session.authorization = {
    accessToken,
  };

  if (authenticatedUser(user.username, user.password)) {
    return res.send("user logged in successfully " + user.username + " ");
  } else {
    return res.status(300).json({ message: "please register first" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn;
  const { review } = req.body;
  const book1 = books[isbn];
  const username = req.user.username;
  if (book1.reviews[username]) {
    book1.reviews[username] = review;
    return res.send(" new review modified succefully by " + username);
  }

  book1.reviews[username] = review;
  return res.send(
    " new review added succefully by " +
      username +
      " The review is  : " +
      book1.reviews[username]
  );
});



// Delete book review
regd_users.delete("/auth/review/:isbn" , (req ,res) => {

  const isbn = req.params.isbn;
  const username= req.user.username;
  let book = books[isbn];
  console.log(book.reviews[username])
  delete book.reviews[username];

res.send("your book review deleted " + req.user.password) ;


})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
