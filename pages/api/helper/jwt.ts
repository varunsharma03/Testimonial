import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';

interface newRequest extends Request{
    payload?:{}
}


const verifyJWT = async (req: newRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader,'auther')
        if (!authHeader ) {
            return res.status(401).json({ message: 'No token provided', data: null });
        }
        const token = authHeader.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format', data: null });
        }
        const verifiedJwt = await JWT.verify(token, 'HEHEHE');
        if(!verifiedJwt)
            return res.status(403).json({ message: 'Invalid Access', data: null });
        req.payload = verifiedJwt;
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(403).json({ message: 'Invalid Access', data: null });
    }
};

export default verifyJWT;
