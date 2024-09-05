import mongoose, {Mongoose,Schema} from "mongoose"

const dbconnect =async ()=>{ mongoose.connect(`mongodb+srv://nagato3:abcd1234@cluster0.5uwzgpa.mongodb.net/testionialDb`)
.then((ele)=>{
    ele?console.log("Db connected "):console.log('error while connecting to Db')
})
.catch((err)=>{
    console.log("Error in connecting to Db",err);
})
}
export default dbconnect;