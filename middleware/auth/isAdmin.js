const isAdmin = (req, res, next) =>{
 
    if (req.user.userType === "admin") {
        next()
    }else{
        return res.status(401).send({message: "you are not admin"})
    }
}
module.exports = isAdmin