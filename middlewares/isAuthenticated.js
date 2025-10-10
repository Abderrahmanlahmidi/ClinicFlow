const jwt = require("jsonwebtoken");


function isAuthenticated(req,res,next){

    try{
        let token = req.get("authorization")

        if(!token){
            return res.status(401).json({success:false, msg:"Token not found"});
        }

        token = token.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.email = decoded.email;
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({success:false, msg:error.message})
    }


}

module.exports = isAuthenticated;