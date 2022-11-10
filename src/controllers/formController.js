const {
    isValid, 
    isValidBody, 
    validEmail, 
    validMobileNum,
    validPwd,
    validTitle,
    validString
}=require('../utils/validation')
const bycrypt=require('bcrypt')
const Form=require('../models/formModel');
const { isValidObjectId, default: mongoose } = require('mongoose');


// ===================================create form api================
const createForm=async (req,res)=>{
    try {
        let data =req.body;
        const {title, name, email, password, number}=data
        if(isValidBody(req.body)){
            return res.status(400).json({status:false, msg:"please enter a valid details"})
        }
        if(!title){
            return res.status(400).json({status:false, msg:"title is required"})
        }
        else if(validTitle(title)){
            return res.status(400).json({status:false, msg:"title only should be [Mr, Mrs, Miss]"})
        }

        if(!name){
            return res.status(400).json({status:false, msg:"name is required"});
        }else if(validString(name)){
            return res.status(400).json({status:false, msg:"Name should be valid and should not contains any numbers"})
        }

        if(!email){
            return res.status(400).json({status:false, msg:"email is required"})
        }else if(validEmail(email)){
            return res.status(400).json({status:false, msg:"Enter a valid email-id"})
        }

        const checkMail=await Form.findOne({email:email});
        if(checkMail){
            return res.status(400).json({status:false, msg:"email is already registerd"})
        }
        
       

        if(!number){
            return res.status(400).json({status:false, msg:"number is required"})
        }else if(validMobileNum(number)){
            return res.status(400).json({status:false, msg:"Enter a valid phone number"})
        }

        const checkNumber= await Form.findOne({number:number});
        if(checkNumber){
            return res.status(400).json({status:false, msg:"number is already registerd"})
        }
       
        
        if(!password){
            return res.status(400).json({status:false, msg:"password is required"})
        } else if(validPwd(password)){
            return res.status(400).json({status:false, msg:"Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters"})
        }
        data.password=await bycrypt.hash(password,10)
        // let tempObj={name,password,password1,number,email,title}
        let form=await Form.create(data);
        res.status(201).json({status:true, msg:"form created successfully",data:form})

    } catch (error) {
        console.log(error)
        res.status(500).json({status:false, msg:error})
    }
}

// ===============================login api ======================
const loginForm = async function (req, res) {
    try {
      let data = req.body;
  
      if (isValidBody(data)) {
        return res.status(400).send({ status: false, msg: "Please provide details" });
      }
  
      if (!isValid(data.email)) {
        return res.status(400).send({ status: false, msg: "Enter valid email id" });
      }
  
      if (!isValid(data.password)) {
        return res.status(400).send({ status: false, msg: "Enter a valid password" });
      }
  
      const checkValidUser = await Form.findOne({ email: data.email, password:data.password });
      if (!checkValidUser) {
        return res.status(400).send({ status: false, msg: "email or password is incorrect" });
      }
  
  // compare the password if match 
      let checkPassword = await bycrypt.compare(data.password,checkValidUser.password);
  
    //   if (!checkPassword) {
    //     return res.status(400).send({ status: false, message: "Password is not correct" });
    //   }
  

    res.status(200).json({status:true, msg:"Form login successfull",data:data})

    } catch (err) {
      res.status(500).send({ msg: err.message });
    }
  };

//   ===============================get all form api=========================

const getAllForms=async (req,res)=>{
    try {
        const allForms=await Form.find();
        if(!allForms){
            return res.status(400).json({status:false, msg:"invalid requrest"})
        }
        return res.status(200).json({status:true, msg:"All form is given", data:allForms})

    } catch (error) {
        console.log(error)
        res.status(500).json({status:false, msg:"internal sever error"})
    }
}

// =======================================get form by id api ===============
 const getFormById=async (req,res)=>{
    try {
        const id = req.params.id;
        
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false, msg:"id is not found"})
        }
        const chechID=await Form.findById(id)
       
        res.status(200).json({status:true, msg:"form found by id field",data:chechID})
       
 } catch (error) {
        console.log(error)
        res.status(500).json({status:false, status:error})
    }
 }


//  ======================update form api ===========================
const updateForm=async (req,res)=>{
    try {
        let data=req.body
        const id=req.params.id;

        if(isValidBody(data)){
            return res.status(400).json({status:false, msg:"if change any field then give the valid value"})
        }
        if(!isValid(id)){
            return res.status(400).json({status:false, msg:"Id is not given"})
        }

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false, msg:"ID is invalid"})
        }

        const findID=await Form.findById(id);
        if(!findID){
            return res.status(400).json({status:false, msg:"no data find"})
        }

        const {number, email,title,name,password}=data
        let updatedForm={}

        if(title){
            if(validTitle(data.title)){
                return res.status(400).json({status:false, msg:"Title should be only [Mr, Mrs, Miss]"})
            }else if(isValid(data.title)){
                return res.status(400).json({status:false, msg:"title should not be empty and only choose [Mr, Mrs, Miss]"})
            }
            updatedForm.title=title
        }
        if(name){
            if(validString(data.name)){
                return res.status(400).json({status:false, msg:"Name only be only character not a number"})
            }
            updatedForm.name=name;
        }
        if(number){
            if(validMobileNum(data.number)){
                return res.status(400).json({status:false, msg:"Enter a valid phone number"})
            }
            const checkNumber=await Form.findOne({number:data.number})
            if(checkNumber){
                return res.status(400).json({status:false, msg:"Same number shuld not be change"})
            }
            updatedForm.number=number;
        }
        if (email) {
            if (!isValid(data.email)) {
              return res.status(400).send({ status: false, msg: "Enter a valid email id" });
            }
           var emailLower = email.toLowerCase()
            if (validEmail(emailLower)) {
              return res.status(400).send({ status: false, message: "EMAIL is invalid" });
            }
      
            let checkEmail = await Form.findOne({ email: data.email });
            if (checkEmail)
              return res.status(400).send({ status: false, message: "Email already exist" });
      
            updatedForm.email = email;
          }

        if(password){
            if(validPwd(data.password)){
                return res.status(400).json({status:false, msg:"Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters"})
            }
            const checkPassword=await Form.findOne({password:password})
            if(checkPassword){
                return res.status(400).json({status:false, msg:"this password already exist, please change your password"})
            }
            updatedForm.password=password;
        }
        const update=await Form.findByIdAndUpdate(id, updatedForm,{new:true})
        res.status(200).json({status:true, msg:"Updated form successfully", data:update})

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg:"internal server error"})
    }
}

// =====================================delete api ======================

const deleteForm=async (req,res)=>{
    try {
        const id=req.params.id;
        if(!isValidObjectId(id)){
            return res.status(400).json({status:false, msg:"invalid id "})
        }
        let result=await Form.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({status:false, msg:"already deleted or not in db"})
        }
        return res.status(200).json({status:true, msg:"form deleted successfully",data:result})

    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false, msg:"internal server error"})
    }
}

module.exports={createForm,getAllForms,updateForm,deleteForm,getFormById, loginForm}