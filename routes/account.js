const express=require("express");
const authMiddleware = require("../middleware");
const {  Account } = require("../db");
const router=express.Router();

//check their balance

router.get("/balance",authMiddleware,async(req,res)=>{
   const account=await Account.findOne({
    userId:req.userId
   })
   res.json({
    balance:account.balance
   })
})

//transfer money 

router.post("/transfer",authMiddleware,async(req,res)=>{
    const {amount,to}=req.body;
    
    const account=await Account.findOne({
       userId:req.userId
    })
    if(account.balance<amount){
        return res.json({
            message:"Insufficient Balance"
        })
    }
    const toAccount=await Account.findOne({
        userId:to
    })
    if(!toAccount){
        return res.json({
            message:"Invalid account"
        })
    }
    await Account.updateOne({
        userId:req.userId
    },{
        $inc:{
            balance:-amount
        }
    })
    await Account.updateOne({
        userId:to
    },{
        $inc:{
            balance:amount
        }
    })
    res.json({
        message:"Money transfer Successfull"
    })
})



module.exports=router;