const Access_token = require("../models/authSchema")

const verifyToken = async (req, res, next) => {
    const token = req.body.access_token || req.query.access_token;

    if (!token) {
        res.status(200).send({ success: false, msg: "A token is required for authentication." })
    }
    try {
        const decode = Access_token.findOne({ access_token: token });
        req.User = decode

    } catch (error) {
        res.status(400).send("Invalid token")
    }
    return next();
}
module.exports=verifyToken;