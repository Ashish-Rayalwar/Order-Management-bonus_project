const { urlencoded } = require("express");
const express = require("express");
const { default: mongoose } = require("mongoose");
const multer = require("multer");

mongoose.set('strictQuery', false);

const router = require("./src/routes/route");
const app = express()
app.use(express.json(urlencoded({extended:true})))
app.use(multer().any())

const dbConnection = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://Ashish:7SiSkJ8Z0nkx2EWh@cluster0.8dgrxmt.mongodb.net/orderManagement",{useNewUrlParser:true})
        console.log("database connected");
    } catch (error) {
        console.log("error while connecting database");
    }
}


app.use("/",router)

dbConnection()





app.listen(3000,()=>{
    console.log("server start");
})