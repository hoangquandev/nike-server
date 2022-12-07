const jwt = require("jsonwebtoken");
const User = require("../../db/models/user");


// xác nhận sign up 

const auth = async (req, res, next) => {
    try {   
        const token = req.header('Authorization').replace('Bearer ', '')  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            return res.status(404).send({message: "user not found"});
        }
        req.token = token
        req.user = user   
        // console.log(req.user);
             
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}
module.exports = auth