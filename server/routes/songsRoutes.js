const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()
const song = require('../models/songModel')
const User = require('../models/Users')
const path = require('path')


const uploadsDirectory = path.join(__dirname, '..', 'uploads');

router.post("/get-all-songs", authMiddleware, (req,res) => {
    song.find()
    .then(songs => {
        // Assuming you want to modify each song object by adding a full path to the file
        const songsWithFullPath = songs.map(song => ({
            ...song._doc,
            fullPath: path.join(uploadsDirectory, song.src)
            
        }));
        

        res.status(200)
            .send({ message: 'Songs fetched successfully', success: true, data: songsWithFullPath });

    })
    .catch(err => {
        res.status(500)
            .send({ message: 'Error fetching songs', success: false, data: err });
    });

})


router.use('/uploads', express.static(uploadsDirectory));

router.get('/get-song/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDirectory, filename);

        // You might want to add additional security checks before sending the file.
        // For example, ensure that the filename is valid, and the file exists.

        res.status(200).sendFile(filePath);
       
    } catch (error) {
        console.error('Error retrieving song:', error);
        res.status(500).send({
            message: 'Error retrieving song',
            success: false,
            data: error,
        });
    }
});
// router.post("/get-all-songs", authMiddleware, (req, res) => {
//     song.find()
//         .then(async songs => {
//             // Map over each song and read the file content as binary data
//             const promises = songs.map(async song => {
//                 const filePath = path.join(uploadsDirectory, song.src);
//                 return filePath
//             });

//             // Wait for all promises to resolve
//             const songsWithBinaryData = await Promise.all(promises);

//             res.status(200).send({ message: 'Songs fetched successfully', success: true, data: songsWithBinaryData });
//         })
//         .catch(err => {
//             res.status(500).send({ message: 'Error fetching songs', success: false, data: err });
//         });
// });

// router.post("/get-all-songs", authMiddleware, (req, res) => {
    
//     song.find()
//         .then(result => {
//             song.src = 
//             res.status(200)
//                 .send({ message: 'songs fetched successfully', success: true, data: result })
//         })
//         .catch(err => {
//             res.status(500)
//                 .send({ message: 'Error fetching songs', success: false, data: err })
//         })


// })


router.post("/add-playlist", authMiddleware, (req, res) => {
    User.findById(req.body.userId)
        .then((user) => {
            const existingPlaylists = user.playlists;
            existingPlaylists.push({
                name: req.body.name,
                songs: req.body.songs,
            });

            return User.findByIdAndUpdate(
                req.body.userId,
                { playlists: existingPlaylists },
                { new: true }
            );
        })
        .then((updatedUser) => {
            res.status(200).send({
                message: "Playlist created successfully",
                success: true,
                data: updatedUser,
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error creating playlist",
                success: false,
                data: error,
            });
        });
});

router.post("/update-playlist", authMiddleware, (req, res) => {
    User.findById(req.body.userId)
        .then((user) => {
            let existingPlaylists = user.playlists;
           existingPlaylists = existingPlaylists.map((playlist) => {
                if(playlist.name === req.body.name){
                    playlist.songs = req.body.songs
                }
                return playlist
           })

            return User.findByIdAndUpdate(
                req.body.userId,
                { playlists: existingPlaylists },
                { new: true }
            );
        })
        .then((updatedUser) => {
            res.status(200).send({
                message: "Playlist updated successfully",
                success: true,
                data: updatedUser,
            });
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error updating playlist",
                success: false,
                data: error,
            });
        });
});

router.post("/delete-playlist", authMiddleware, (req, res) => {
    User.findById(req.body.userId)
      .then(user => {
        let existingPlaylists = user.playlists;
        existingPlaylists = existingPlaylists.filter((playlist) => {
          return playlist.name !== req.body.name;
        });
  
        return User.findByIdAndUpdate(
          req.body.userId,
          { playlists: existingPlaylists },
          { new: true }
        );
      })
      .then(updatedUser => {
        res.status(200).send({
          message: "Playlist deleted successfully",
          success: true,
          data: updatedUser,
        });
      })
      .catch(error => {
        console.log(error);
        res.status(500).send({
          message: "Error deleting playlist",
          success: false,
          data: error,
        });
      });
  });

module.exports = router;