const mongoose=require("mongoose");

const resetSchema=mongoose.Schema({
    password_Access_Token:{
        type:String,
        require:true,
    },
})
module.exports=Password_Reset_Token=mongoose.model('Password_Reset_Token',resetSchema);