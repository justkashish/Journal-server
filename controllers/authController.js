const User = require("../models/User")
const jwt = require("jsonwebtoken")

// Register a new user
exports.register = async(req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if user already exists
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
        })

        await user.save()

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
            },
        }

        // Sign token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
            if (err) throw err
            res.json({ token })
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

// Login user
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body

        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Check password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
            },
        }

        // Sign token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
            if (err) throw err
            res.json({ token })
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}

// Get user profile
exports.getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Server error")
    }
}