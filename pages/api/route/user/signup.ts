import { Request, Response } from 'express';
import dbconnect from '../../dbconnect/Db';
import UserModel from '../../models/UserModel';
import bcrypt from "bcryptjs"


export default async function handler(req: Request, res: Response) {
    if (req.method === 'POST') {

        try {
            const { name, email, password,testimonial } = req.body;
            dbconnect();
            console.log('heheh')
            const hashedPassword= await bcrypt.hash(password,10);
            console.log(hashedPassword);
            await UserModel.create({ name, email, password:hashedPassword })
                .then((ele) => {
                    if (ele)
                        return res.status(200).json({ message: "New user created successfully Please login", data: {} })
                    else
                        return res.status(400).json({ message: "Error in creating user", data: null });
                })
                .catch((err) => {
                    return res.status(200).json({ message: "Error while creating", data: null });
                })

        } catch (err) {
            return res.status(200).json({ message: "Error in parsing" })
        }

    }
}
