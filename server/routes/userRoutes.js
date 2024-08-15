const express = require('express');
const router = express.Router();
const UserModel = require('../models/Users')
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/authMiddleware");
const { reset } = require('nodemon');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json('Email and password are required');
    }

    UserModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res
                    .status(200)
                    .send({ message: "User does not exist", success: false })
            }
            const passwordmached = user.password === password ? true : false
            if (passwordmached) {
                const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
                    expiresIn: '1d',
                })
                return res
                    .status(200)
                    .send({
                        message: "User logged in successfully",
                        success: true,
                        data: token,
                    })
            } else {
                return res
                    .status(200)
                    .send({ message: "Password is incorrect", success: false })
            }

        })
        .catch(err => {
            res.status(500).send({ message: err.message, success: false });
        })
})

router.post('/register', (req, res) => {
    const user = new UserModel(req.body);
    UserModel.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(200).send({ message: "User already exists", success: false });
            }
            else {
                user.save();
                return res.status(200).send({ message: "User registerd successfully", success: true });
            }
        })
        .catch(err => {
            res.status(500).json('Internal server error');
        })
})

router.post('/get-user-data', authMiddleware, (req, res) => {
    UserModel.findById(req.body.userId)
        .then((user) => {
            user.password = undefined
            return res.status(200).send({
                message: "User data fetched successfully",
                success: true,
                data: user,
            })
        })
        .catch((error) => {
            return res.status(500).send({ message: error.message, success: false })
        })
})
router.post("/get-all-users", authMiddleware, (req,res) => {
    UserModel.find()
    .then(users => {
         res.status(200).send({
            message : "users fetched successfully",
            success : true,
            data: users
         }) 
        })
         .catch((err) => {
        res.status(500)
            .send({ message: 'Error fetching songs', success: false, data: err });
    });

})
module.exports = router;
