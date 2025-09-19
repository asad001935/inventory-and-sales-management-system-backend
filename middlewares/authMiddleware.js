const { getUserIdByToken } = require("../config/jwtProvides");
const userServices = require("../services/userServices");

const authenticate = async(req,res, next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const userId = await getUserIdByToken(token);
        const user = await userServices.getUserById(userId);
        req.user = user;
    } catch (error) {
        return res.status(401).json({error: error.message});
    }
    next();
};

const roleCheck = (...allowedRoles) =>{
    return(req,res,next)=>{
        try {
            const user = req.user;
            if(!user || !user.role){
                return res.status(403).json({message:"Access denied. No role found!"})
            };
            if(!allowedRoles.includes(user.role)){
                return res.status(403).json({message:'Access Denied. Insufficient roles'})
            };
            next();
        } catch (error) {
            console.error(("Role check error: ", error));
            res.status(500).json({message:"Server error in role check"})
        }
    }
}

module.exports = {authenticate, roleCheck};