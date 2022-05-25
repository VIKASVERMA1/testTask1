const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    userName:{
        type:String,
        require:true,
        index: {
            unique: true
          }
    },
    email_id:{
        type:String,
        require:true,
        index: {
            unique: true
          }
    },
    password:{
        type:String
    },
    confirmPassword:{
        type:String
    }
})
module.exports=Users=mongoose.model('userdata',userSchema);