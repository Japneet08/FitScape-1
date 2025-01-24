
const mongoose = require('mongoose');
const bcrypt=require('bcrypt')

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength:[3,"name must be of 3 charecters"]

  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase:true,
  },
  password: {
    type: String,
    required: true,
    minlength:[6,"password must be of min 6 charecters"]
  },
  age: {
    type: Number,
    
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    // required: true
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp:{
    type:String,
    default:""
  },
  otp_expiry:{
    type:Date,
    default:""
  },
  reset_token:{
    type:String,
    default:""
  },
  reset_token_expiry:{
    type:Date,
    default:""
  },
  role:{
    type:String,
    enum:["ADMIN","USER","TRAINER"],
    default:"USER"
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
   
  },
  goals: {
    type: [String],
    default:[] 
  }
  
},{timestamps:true});
userSchema.statics.hashPassword= async function(password){
  const salt=await bcrypt.genSalt(10);
  return await bcrypt.hash(password,salt)
   

}
const userModel = mongoose.model('User', userSchema);

module.exports = userModel
