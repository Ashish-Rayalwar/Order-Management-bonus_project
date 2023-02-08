const express = require("express");
const { createCustomers,getCustomerById,loginCustomer } = require("../controller/customerController");
const { createOrder,getOrders } = require("../controller/orderController");
const { verifyToken, verifyTokenAndAuthorization } = require("../middleware/auth");


const router = express.Router()



router.post("/customers",createCustomers)
router.post("/login",loginCustomer)
router.post("/orders",verifyToken,createOrder)
router.get("/customers/:customerId", verifyTokenAndAuthorization,getCustomerById)
router.get("/orders/:orderId",verifyToken,getOrders)

router.all("/*",(req,res)=>{
    console.log("Plz enter valid route, orderManagement");
    res.status(400).send({msg:"invalid route"})
})

module.exports = router