import { NextRequest, NextResponse } from 'next/server';
import verifyJWT from '../../helper/jwt';
import { newRequest } from '../../helper/newRequest';
import { Request } from 'express';
import mongoose from 'mongoose';
import TestimonialModel from '../../models/TestimonialModel';
import { reviewSchema } from '../../models/TestimonialModel';


interface apiRequest extends Request {
    payload?: {}
}

export default async function handler(req: apiRequest, res: any) {

    console.log("heheheh")
    if (req.method === 'POST') {
        try {
            await new Promise<void>((resolve, reject) => {
                verifyJWT(req, res, (err: any) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            const reviewId = new mongoose.Types.ObjectId(req.body.reviewId as string || '');
            const Tid = new mongoose.Types.ObjectId(req.body.Tid as string || '');
            const liked = req.body.liked;
            console.log(liked,'this is the liked value fro request')
            let response = await TestimonialModel.findOne(
                {
                    $and: [
                        { "_id": Tid }, { "review.reviewId": reviewId }
                    ]
                }
            )
            if (!response)
                return res.status(403).json({ message: "Can't find review" });

            response.review = response.review.map((ele: any) => {
                if (ele?.reviewId?.toString() == reviewId.toString()) {
                    if(liked){
                        ele.liked=true;
                    }else {
                        ele.liked=false;
                    }
                }
                return ele;
            })
            await response.save();
            response=response.review?.filter((ele:any)=>ele?.reviewId?.toString() == reviewId.toString())
            return res.status(200).json({ message: "heii", reviewId, Tid, liked, response });

        } catch (err) {
            console.error('Error:', err);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }
}
