const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://abdulhaq:abdul78@cluster0.hz7ufdx.mongodb.net/TestDb?retryWrites=true&w=majority")
    .then(() => {
        console.log("MongoDB Connected");

        app.listen(4000, () => {
            console.log("Server running on port 4000");
        });
    })
    .catch((err) => {
        console.log(err);
    });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.status(200).json("Server is running!");
});
app.post("/user", async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});



app.post("/users", async (req, res) => {
    try {
        const users = await User.insertMany(req.body);
        res.status(201).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});



app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});



app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        res.json(user);

    } catch (err) {
        res.status(400).json({ message: "Invalid ID" });
    }
});



app.put("/users/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: "Invalid ID" });
    }
});


app.delete("/users/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        res.json({ message: "User Deleted Successfully" });
    } catch (err) {
        res.status(400).json({ message: "Invalid ID" });
    }
});


app.listen(4000, () => {
    console.log("Server running on port 4000");
});