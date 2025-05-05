const express = require("express");
const db = require("./database.js");
const jwt = require("jsonwebtoken");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get('/welcome', (req, res) => res.sendFile(path.join(__dirname, "public", "welcome.html")));

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    
    // Check if the user already exists based on email
    let userExists = await db.getData(email);
    
    if (JSON.parse(userExists).length > 0) {
        res.json({ signup: false, error: "User already registered with this email" });
    } else {
        const token = jwt.sign({ name, email }, "secret_key");
        let newUser = { name, email, password, token };
        let result = await db.insertData(newUser);
        res.json({ signup: true, token, result });
    }
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let user = await db.getData(email, password);
    
    if (JSON.parse(user).length > 0) {
        const token = jwt.sign({ email }, "secret_key");
        res.json({ message: "Welcome to your profile",login: true, token, data: JSON.parse(user) });
    } else {
        res.json({  login: false, error: "Invalid username or password" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});
