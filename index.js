const express=require("express")
const app=express()
require('./flipkart/flipkart')
require('./snapDeal/snapdeal')



port=8081

app.listen(port,()=>{
console.log(`Your server is running ${port}`)
})

