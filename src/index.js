const express=require('express')
const app=express();
const route=require('./route/router')
const bodyParser=require('body-parser');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

const PORT=process.env.PORT || 4000;
mongoose.connect("mongodb+srv://Avi9984:JM6hnTiQIRViVdA3@cluster0.qfc4n.mongodb.net/User-From",{
    useNewUrlParser:true
})
.then(()=>console.log("MongoDB is connected!..."))
.catch((err)=>{
    console.log(err)
})


app.use('/',route)

app.listen(PORT, ()=>{
    console.log(`Server is running in the port is: ${PORT}`)
})


