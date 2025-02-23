const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

const SECRET_KEY = "shubham"; // Change this to a strong secret key

// 🔹 User Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, registrationNo } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                registrationNo,
            },
        });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 🔹 User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

        res.json({username:user.name,email:user.email,registrationNo:user.registrationNo, message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 🔹 Middleware to Protect Routes
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const verified = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// 🔹 Get User Details (Protected Route)
router.get("/userdetail", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error("User details error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
