const express = require('express');
const app = express();
const db = require('./models');
const User = require("./models/User");
const cookieParser = require('cookie-parser');
const { createTokens, validateToken } = require('./JWT');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require("mongoose");

const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cookieParser());

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        User.create({ username, password: hash })
            .then(user => res.json(user))
            .catch(err => res.status(400).json(err));
    }).catch(err => res.status(400).json(err));
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const dbPassword = user.password;
        const match = await bcrypt.compare(password, dbPassword);
        if (!match) {
            return res.status(400).json({ error: "Wrong username and password combination" });
        } else {
            
            const accessToken = createTokens(user);

            res.cookie("access-token", accessToken, {
                maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
                httpOnly: true
            });

            res.json("Login succesful!");
        }

});


app.get("/profile", validateToken, (req, res) => {
    res.json("profile");
});

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch(err => console.log("MongoDB Connection Error:", err));