import mongoose, {Mongoose, Schema} from "mongoose"

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false,
    },
    hash:{
        type:String,
        default:''
    },
    testimonial:[{
        type: Schema.Types.ObjectId,        
    }],
    is_deleted:{
        type:Boolean,
        default:false
    }
})

const UserModel =mongoose.models?.userModel || mongoose.model('userModel',UserSchema);
export default UserModel;