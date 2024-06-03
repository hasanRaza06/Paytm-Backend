const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://root:root@cluster0.xfodwth.mongodb.net/paytm")
.then(()=>{
    console.log("DB Connected");
}).catch((e)=>{
    console.log("Something went wrong");
})

const userSchema=mongoose.Schema({
    username:{
        type:String,
        minLength:3,
        maxLength:30,
        required:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        minLength:6,
        maxLength:12,
        required:true
    },
    firstname:{
        type:String,
        minLength:3,
        trim:true
    },
    lastname:{
        type:String,
        trim:true
    }
})

const accountSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, //refer to User teble
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const User=mongoose.model('User',userSchema);
const Account=mongoose.model('Account',accountSchema);

module.exports={
    User,
    Account
}