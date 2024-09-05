import mongoose, {mongo, Schema} from "mongoose";


const reviewSchema = new Schema({
    testimonial:{
        type:Schema.Types.ObjectId,
        required:true
    },
    feedback:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    state: {
        type: String,
        enum: ['POSITIVE', 'NEGATIVE'],
    },
    rating:{
        type:Number,
        required:true
    }
})

const ReviewModel = mongoose.models?.reviewModel || mongoose.model("reviewModel",reviewSchema);
export default ReviewModel;