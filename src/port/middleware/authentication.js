import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const aunthtoken=(req,res,next)=>{


    const authheader =req.header['Authorization'];
    const token =authheader?.split(' ')[1] && authheader;

    if(!token)
    {
        return res.sendStatus(401).json({message:'Token not provieded'});
    }
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if (err){
                return res.sendStatus(403);

            }
        else
        {
            req.user =user;
            next();
        }
});
    
};
exports.aunthtoken =aunthtoken;