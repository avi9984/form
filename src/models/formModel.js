const mongoose=require('mongoose')

const formSchema=new mongoose.Schema({
    title:{type:String, required:true, trim:true},
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, unique:true},
    number:{type:String, required:true, unique:true},
    password:{type:String, required:true},
   


},{timestamps:true});
module.exports=mongoose.model("User-Form", formSchema)