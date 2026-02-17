
import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_SECRET

export const verifytoken =(req,res,next)=>{
    const auth = req.headers.authorization;
    if(!auth){
        return res.status(500).json({
            message:'Access Denied'
        });
    }
    const token = auth.split(" ")[1];
    try{
        const decoded  = jwt.verify(token,JWT_KEY);
        req.user=decoded;
        next();
    }catch(error){
      res.status(500).json({message:'Failed',
        error:error.message
      });
    }
};

export const isadmin=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(403).json({
            message:'Access denied'
        });
    }
    next();
};