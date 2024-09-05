import { Request, response, Response } from 'express';
import dbconnect from '../../dbconnect/Db';
import UserModel from '../../models/UserModel';
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import verifyJWT from '../../helper/jwt';
import { newRequest } from '../../helper/newRequest';
import mongoose, { Mongoose } from 'mongoose';


export default async function handler(req: newRequest, res: Response) {
    if (req.method === 'POST') {

        try {
            const { email, password } = req.body;
            dbconnect();
            await UserModel.findOne({ email })
                .then(async (user) => {
                    if (user) {
                        let passowrdMatched = await bcrypt.compare(password, user.password)
                        if (!passowrdMatched) {
                            return res.status(400).json({ message: "Incorrect Password", data: null });
                        }
                        let payload = {
                            user_id: user?._id,
                            name: user?.name
                        }
                        let token = JWT.sign(payload, 'HEHEHE', { expiresIn: '2h' });
                        return res.status(200).json({ message: "Logged in Successfully", data: { token } })

                    }
                    else {
                        return res.status(402).json({ message: "Please SignUp to continue", data: null });
                    }
                })
                .catch((err) => {
                    return res.status(200).json({ message: "Error while logging", data: null });
                })

        } catch (err) {
            return res.status(200).json({ message: "Error in parsing" })
        }

    }
    else if (req.method == 'GET') {
        dbconnect();
        verifyJWT(req, res, async () => {
            const user_id = req.payload?.user_id;
            const testimonial_available = await UserModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(user_id)
                    }
                },
                {
                    $unwind: {
                        path: '$testimonial',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'testimonialmodels',
                        localField: 'testimonial',
                        foreignField: '_id', 
                        as: 'yourtestimonials' 
                    }
                },
                {
                    $unwind: {
                        path: '$yourtestimonials',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'productmodels', 
                        localField: 'yourtestimonials.product',
                        foreignField: '_id', 
                        as: 'productDetails' 
                    }
                },
                {
                    $unwind: {
                        path: '$productDetails',
                        preserveNullAndEmptyArrays: true 
                    }
                },
                {
                    $group: {
                        _id: '$_id', 
                        name: { $first: '$name' },
                        email: { $first: '$email' },
                        testimonials: { $push: {
                            testimonial: '$yourtestimonials',
                            product: '$productDetails'
                        }} 
                    }
                }
            ]);
            testimonial_available[0].testimonials=testimonial_available[0]?.testimonials?.filter((ele:any)=>ele?.testimonial)
            return res.status(200).json({ messaege: "Your Testimonials", data: (testimonial_available[0] || null) });



        })
    }
}
