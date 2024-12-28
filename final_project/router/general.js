const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  //Write your code here
  const user = req.body;
  if (user) {
    if (user.username == "username" && user.password == "password") {
      return res.send("user already registred");
    } else if (user.username != undefined || user.password != undefined) {
      users.push({
        username: user.username,
        password: user.password,
      });
      return res.send(
        `the user : "${user.username}" has been registred succefully`
      );
    } else {
      return res.send("body empty");
    }
  }
});

// get book list available
async function getBookList() {
  try {
    const response = await axios.get("http://localhost:5000/");
    console.log("Book List:", response.data);
  } catch (error) {
    console.error("Error fetching book list:", error.message);
  }
}

// get book detail by ISBN
async function getBooksByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("Book :", response.data);
  } catch (error) {
    console.error("Error fetching book list:", error.message);
  }
}
// get book deatail by title
async function getBookByTitle(title) {
  try {
    const response = await âxios.get(`http://localhost:5000/title/${title}`);
    console.log("Book:", response.data);
  } catch (error) {
    console.error("Error fetching book list:", error.message);
  }
}

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const bookList = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
    res.send(bookList);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const fetched_author = Object.values(books).find(
    (book) => book.author === author
  );
  return res.send(fetched_author);
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  //Write your code here
  const title = req.params.title;
  const fetched_title = Object.values(books).filter(
    (book) => book.title === title
  );
  return res.send(fetched_title);
});

//  Get book review
public_users.get("/review/:title", function (req, res) {
  const title = req.params.title;
  const fetched_title = Object.values(books).find(
    (book) => book.title === title
  );
  return res.send(fetched_title.reviews);
});

module.exports.general = public_users;
