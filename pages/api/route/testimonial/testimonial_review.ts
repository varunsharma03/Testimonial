import { NextApiRequest, NextApiResponse } from "next";
import dbconnect from "../../dbconnect/Db";
import TestimonialModel from "../../models/TestimonialModel";
import mongoose from "mongoose";
import moment from "moment";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await dbconnect();
            const { Tid, feedback, email, name, rating } = req.body;

            if (!Tid || !feedback || !email || !name || !rating) {
                return res.status(400).json({ message: 'Missing required fields', data: null });
            }
            const testimonialId = new mongoose.Types.ObjectId(Tid as string);
            const reviewId= new mongoose.Types.ObjectId();
            const date = moment().format('YYYY-MM-DD');
            const review = {
                date,
                reviewId,
                feedback,
                email,
                name,
                rating,
                liked:true
            };
            const result = await TestimonialModel.updateOne(
                { _id: testimonialId },
                { $push: { review: review } } 
            );
            if (result.modifiedCount > 0) {
                return res.status(200).json({ message: 'Thanks for the review', data: review });
            } else {
                return res.status(400).json({ message: 'Error creating review', data: null });
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Internal Server Error', data: null });
        }
    } else if(req.method==='GET') {
        try{
            const Tid= (req.headers.id)?.toString();
             console.log(Tid,'this is Tid')
             const data = await TestimonialModel.aggregate([
                { $match: { '_id': new mongoose.Types.ObjectId(Tid) } },
                { $lookup: {
                    from: 'productmodels', 
                    localField: 'product',
                    foreignField: '_id',
                    as: 'ProductData'
                }},
                { $unwind: {
                    path: '$ProductData',
                    preserveNullAndEmptyArrays: true 
                }},
                { $project: {
                    _id: 1, 
                    User: 1, 
                    product: 1,
                    review: 1, 
                    rating: 1, 
                    live: 1, 
                    is_delted: 1, 
                    link: 1, 
                    ProductData: 1 
                }},
                { $addFields: {
                    testimonial: {
                        ProductData: '$ProductData'
                    }
                }},
                { $replaceRoot: { newRoot: '$testimonial' } } 
            ]);
            
            return res.status(200).json({message:'Lo ji db',data})
        }catch(err){
            return  res.status(400).json({message:'Tenga',data:null})
        }
    }
}
