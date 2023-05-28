const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

function getData(){
    return new Promise((resolve, reject) =>{
        resolve(JSON.stringify(books,null,4));
    });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getData()
        .then(data =>{
            res.status(201).send(data);
        })
        .catch(data =>{
            res.status(500).send("Error retrieving data");
        });
});

function getBookIsbn(isbn){
    return new Promise((resolve, reject) =>{
        resolve(books[isbn]);
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBookIsbn(isbn)
        .then(data =>{
            res.status(201).send(data);
        })
        .catch(data =>{
            res.status(500).send("Error retrieving data");
        });
 });

function getBookAuthor(author){
    return new Promise((resolve, reject) =>{
        temp_books = Object.values(books);
        let filtered_books = temp_books.filter((book) => book.author === author);
        resolve(filtered_books);
    });
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBookAuthor(author)
    .then(data =>{
        res.status(201).send(data);
    })
    .catch(data =>{
        res.status(500).send("Error retrieving data");
    });
});

function getBookTitle(title){
    return new Promise((resolve, reject) =>{
        temp_books = Object.values(books);
        let filtered_books = temp_books.filter((book) => book.title === title);
        resolve(filtered_books);
    });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBookTitle(title)
    .then(data =>{
        res.status(201).send(data);
    })
    .catch(data =>{
        res.status(500).send("Error retrieving data");
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
