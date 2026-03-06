const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://abdulhaq:abdul78@cluster0.hz7ufdx.mongodb.net/TestDb?retryWrites=true&w=majority")
    .then(() => {
        console.log("MongoDB Atlas Connected");
    })
    .catch((err) => {
        console.log(err);
    });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, "Name must be atleast 2 character"],
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email must be required!"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password must be required!"],
        minlength: [6, "Password must be atleast 6 character"],
    },

    role: {
        type: String,
        enum: ["Student", "Mentor", "Admin"],
        default: "Mentor"
    }
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.post("/user", async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name) {
        return res.status(404).json({
            message: "Name is required!"
        });
    }
    if (!email) {
        return res.status(404).json({
            message: "Name is required!"
        });
    }

    if (!password) {
        return res.status(404).json({
            message: "password is required!"
        });
    }
    if (!role) {
        return res.status(404).json({
            message: "role is required!"
        });
    }


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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});