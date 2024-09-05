import { Request, Response } from "express";
import { newRequest } from "../../helper/newRequest";
import verifyJWT from "../../helper/jwt";
import ProductModel from "../../models/ProductModel";
import TestimonialModel from "../../models/TestimonialModel";
import mongoose from "mongoose";
import UserModel from "../../models/UserModel";
import dbconnect from "../../dbconnect/Db";
import multer from "multer"



const storage= multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,"/public")
    },
    filename:function(req,file,cb){
        return cb(null,file.originalname)
    }
})
const upload = multer({ storage });
export default async function handler(req: newRequest, res: Response) {
    if (req.method === 'POST') {
        try {
            await dbconnect();
            await new Promise<void>((resolve, reject) => {
                verifyJWT(req, res, (err: any) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            const user_id = new mongoose.Types.ObjectId(req.payload?.user_id);
            console.log(req.body,'this is userid')
            const { product_name, description,photo } = await req.body
            if (!product_name || !photo || !description) {
                return res.status(400).json({ message: "Please add all the necessary fieldsss", data: null });
            }

            // return res.status(400).json({ message: "Please add all the necessary fields", data: null })
            const product = await ProductModel.create({
                name: product_name,
                author: user_id,
                photo,
                description
            });
            if (!product) {
                return res.status(400).json({ message: "Error in creating Product", data: null });
            }
            const testi = await TestimonialModel.create({
                User: user_id,
                product: product._id
            });

            if (!testi) {
                await ProductModel.findOneAndDelete({ _id: product._id });
                return res.status(400).json({ message: "Error in creating Testimonial", data: null });
            }
            await UserModel.updateOne(
                { _id: user_id },
                { $push: { testimonial: testi._id } }
            );

            return res.status(200).json({
                message: "Testimonial Created Successfully",
                data: {
                    product,
                    testi
                }
            });
        } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: "Internal Server Error", data: null });
        }
    } 
}
