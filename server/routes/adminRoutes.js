const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()
const multer = require('multer')
const song = require('../models/songModel')
const User = require('../models/Users')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage })
router.post('/add-song', authMiddleware, upload.single('file'), (req, res) => {
    const uploadFile = req.file;

    const newsong = new song({
        title: req.body.title,
        artist: req.body.artist,
        src: uploadFile.filename,
        album: req.body.album,
        duration: req.body.duration,
        year: req.body.year,
    });

    newsong.save()
        .then(() => song.find())
        .then(allSongs => {
            res.status(200).send({
                message: "Song added successfully",
                success: true,
                data: allSongs,
            });
        })
        .catch(error => {
            res.status(500).send({
                message: "Error adding song",
                success: false,
                data: error,
            })
        })
})

router.post('/edit-song', authMiddleware, upload.single('file'), (req, res) => {
    const uploadFile = req.file;
    let response = null
    if (uploadFile) {
        response = song.findByIdAndUpdate(req.body._id, {
            title: req.body.title,
            artist: req.body.artist,
            src: uploadFile.filename,
            album: req.body.album,
            duration: req.body.duration,
            year: req.body.year,
        })
    } else {
        response = song.findByIdAndUpdate(req.body._id, {
            title: req.body.title,
            artist: req.body.artist,

            album: req.body.album,
            duration: req.body.duration,
            year: req.body.year,
        })
    }
    response
        .then(() => song.find())
        .then(allSongs => {
            res.status(200).send({
                message: "Song edited successfully",
                success: true,
                data: allSongs,
            });
        })
        .catch(error => {
            res.status(500).send({
                message: "Error editing song",
                success: false,
                data: error,
            });
        });
})
router.delete('/delete-user/:userId', authMiddleware, (req, res) => {
    const userId = req.params.userId;
    User.findOneAndDelete({ _id: userId })
        .then((result) => {
            res.status(200).send({
                message: "Succesfully deleted user",
                success: true,
                data : result
            })
        })
        .catch(err =>{
            res.status(500).send({
                Message: "Error deleting user",
                success: false,
                data: err
            })
        })
})

module.exports = router