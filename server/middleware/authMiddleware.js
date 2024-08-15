const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1]

    try {
        jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            req.body.userId = decoded.userId;
            next();
        });
    } catch (error) {
        
        return res.status(500).send({ message: "Internal server error", success: false });
    }
}