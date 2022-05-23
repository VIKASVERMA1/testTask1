const mongoose=require("mongoose");
const Users=require("../userSchema")


const addressSchema=mongoose.Schema({
    user_id:{
        type:String,
        require:true,
    },
    user_addresses:{
        type:Array,
  
    }
})
module.exports=Address=mongoose.model('addresses',addressSchema);