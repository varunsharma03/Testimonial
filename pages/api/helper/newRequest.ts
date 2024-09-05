import { Request } from "express"
import { NextApiRequest } from "next"
export interface newRequest extends Request{
    payload?:{
        user_id:string,
        name:string
    }
}