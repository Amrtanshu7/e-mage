const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;

    //check header exists

    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({message:"authorization token missing"});
    }

    //extract token
    const token = authHeader.replace("Bearer","").trim();

    console.log("the value of token is:",token);

    try{
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user info to request

        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (err) {

        return res.status(401).json({message:"Invalid or expired token"});
    }
};

module.exports = authMiddleware;