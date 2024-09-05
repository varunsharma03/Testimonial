import mongoose, {Schema} from "mongoose";


const productSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        required:true
    },
    photo:{
        type:String,
    },
    description:{
        type:String,
        required:true
    }
})

const ProductModel= mongoose.models?.productModel || mongoose.model("productModel",productSchema);
export default ProductModel;