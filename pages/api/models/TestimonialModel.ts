import mongoose, { Schema } from "mongoose";

// Define the review schema
export const reviewSchema = new Schema({
    feedback: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    liked:{type:Boolean,default:true},
    date:{type:String},
    reviewId:{type:mongoose.Types.ObjectId,required:true}
}, { _id: false }); 


const testimonialSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        required: true
    },
    review: {
        type: [reviewSchema], 
        default: []
    },
    rating: {
        type: Number
    },
    live: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    link: {
        type: String
    }
});

const TestimonialModel = mongoose.models?.TestimonialModel || mongoose.model("TestimonialModel", testimonialSchema);
export default TestimonialModel;
