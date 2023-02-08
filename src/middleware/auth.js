const  jwt  = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");








const verifyToken = async (req,res,next)=>{

    try {

        /// USE BEARER TOKEN

        let token = req.headers["authorization"]
    if(!token) return res.status(400).send({status:false,message:"Token is mandatory"})
    token = token.slice(7, token.length)
    

    // if(!validator.isJWT(token)) return res.status(400).send({status:false,msg:"Token is invalid"})

    if(token){

    jwt.verify(token,"bonus-project-orderMangement",(err,tokenDetails)=>{
        if(err) return res.status(403).send({status:false,message:err.message})
        req.tokenDetails = tokenDetails
        next()
    })
    }else{
        return res.status(401).send({status:false,msg:"you are not authenticated"})
    }
    } catch (error) {
        res.status(500).send({status:false,message:error.message})
        console.log("error in verifyToken", error.message)
    }
   
}



const verifyTokenAndAuthorization = async(req,res,next)=>{
    try {
        verifyToken(req,res,async()=>{
            let customerId = req.params.customerId;
          
            if(req.tokenDetails.customerId == customerId){
                next()
            }else{
                res.status(403).send({msg:"you are not authorized to perform this task"})
            }
        })
    } catch (error) {
        res.status(500).send({status:false,message:error.message})
        console.log("error in verifyTokenAndAuthorization", error.message)
    }
}






module.exports = {verifyToken,verifyTokenAndAuthorization}