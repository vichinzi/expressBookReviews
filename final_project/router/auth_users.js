const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        let reviews = book.reviews;
        let auth = req.session.authorization; 
        let user = auth.username;
        let my_review = reviews[user];

        book.reviews[user] = req.query.review;

        if(my_review){
            return res.status(201).json({message: "Review updated"});
        }
        else{
            return res.status(201).json({message: "Review posted"});

        }
    }
    else{
        return res.status(400).json({message: "Book does not exist"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        let reviews = book.reviews;
        let auth = req.session.authorization; 
        let user = auth.username;
        let my_review = reviews[user];
        if(my_review){
            delete reviews[user];
            return res.status(201).json({message: "Review deleted"});
        }
        else{
            return res.status(400).json({message: "Review not createdd yet"});
        }
    }
    else{
        return res.status(400).json({message: "Book does not exist"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
