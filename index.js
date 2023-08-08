const express=require("express");
const cors = require('cors');
const router = require("./Router/Router");
const app=express();
app.use(cors({
    origin: '*'
}));

app.use(express.json())
app.use("",router)

app.listen(process.env.PORT || 8080 ,async(req,res)=>{
    try {
        console.log("Connected")
    } catch (error) {
        console.log("Connection Error")
    }
})