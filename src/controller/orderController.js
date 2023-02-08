const { isValidObjectId, default: mongoose } = require("mongoose");
const customerModel = require("../models/customerModel");
const { findOneAndUpdate } = require("../models/orderModel");
const orderModel = require("../models/orderModel");
const { isValidTitle, isvalidRating } = require("../validator");

const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY);



require("dotenv").config()
const createOrder = async(req,res)=>{

    let data = req.body
    if(Object.keys(data).length===0) return res.status(400).send({status:false,message:"Provide details for create ypur profile"})
    let {title,customerId,discription,price,...rest} = data
    if(Object.keys(rest).length>0) return res.status(400).send({status:false,message:"invalid details"})

    if (!title)  return res.status(400).send({ status: false, message: "title is required" }) 
    if(!isValidTitle(title)) return res.status(400).send({ status: false, message: "title is invalid" }) 

    if(!customerId)  return res.status(400).send({ status: false, message: "customerId is required" }) 
    if(!isValidObjectId(customerId)) return res.status(400).send({status:false,message:"Invalid customerId "})

    if(!discription) return res.status(400).send({ status: false, message: "discription is required" }) 
    if(!isValidTitle(discription)) return res.status(400).send({status:false,message:"Invalid discription details "})

    if(!price) return res.status(400).send({ status: false, message: "price is required" }) 
    if(!isvalidRating(price)) return res.status(400).send({ status: false, message: "discription is invalid, must be number" }) 

    let orderDetails = {title,customerId,discription,price} 
    let createOrder = await orderModel.create(orderDetails)
    let updateOrder = await customerModel.findOneAndUpdate({_id:customerId},{$inc:{orders:1}})
    let customerOrder = await customerModel.findOne({_id:customerId})
    if(!customerOrder) return res.status(400).send({status:false,message:"Invalid CustomerId"})

   


    let ordersCount = customerOrder.orders
    let goldDiscount = (price * 10) / 100 + customerOrder.wallet
    let platinumDiscount = ((price * 20) / 100 ) + customerOrder.wallet
   

    if(ordersCount>10 && ordersCount<=20) {
     await customerModel.findOneAndUpdate({_id:customerId},{$set:{wallet:goldDiscount,role:"gold"}})
     await orderModel.findOneAndUpdate({customerId:customerId},{$set:{discount:10}})
    }
    if(ordersCount>20) {
     await customerModel.findOneAndUpdate({_id:customerId},{$set:{wallet:platinumDiscount,role:"platinum"}})
     await orderModel.findOneAndUpdate({customerId:customerId},{$set:{discount:20}})
    }

  let {discount,...otherData} = createOrder._doc



  let email = customerOrder.email
 
   

  const sendEmail = async () => {
  const msgConfig = {
    
    to: `${email}`,
    from: process.env.EMAIL_FROM,
    
    subject: "Sendgrind test mail",
    text: "This is a test mail from nodejs using sendgrid",
    
    
}
try {
  await sgMail.send(msgConfig)
  console.log("Email Sent to: ", msgConfig.to)
  
} catch (error) {
  
  console.log(error.message)
}



  }
  sendEmail()


  
  
    return res.status(201).send({status:true,message:"Success",data:otherData})
    


}



const getOrders = async (req,res)=>{

 
  let orderId = req.params.orderId
  console.log(orderId)

  if(!mongoose.isValidObjectId(orderId)) return res.status(400).send({status:false,message:"Invalid orderID"})

  let getOrder = await orderModel.findOne({_id:orderId})
console.log(getOrder)
  if(!getOrder) return res.status(404).send({status:false,message:"Order not found"})
  
  return res.status(200).send({status:true,data:getOrder})


}
module.exports = {createOrder,getOrders}