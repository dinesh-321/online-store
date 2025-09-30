import jwt from 'jsonwebtoken';

const authSeller = async(req,res,next)=> {
    const { token } = req.cookies;

    if(!token){
        return res.json({ success: false, message: 'Not Authorized token' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded.id){
            return res.json({ success: false, message: 'Invalid Token' })
        }
        req.sellerId = decoded.id;
        next();
    }
    catch(error){
        res.json ({ success : false, message : error.message});
    }
}

export default authSeller;