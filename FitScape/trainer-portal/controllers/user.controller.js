const { sendEmail } = require('../config/email.config');
const userModel = require('../models/user.model');
const { validationResult } = require('express-validator');
const sendOTP = require('../services/otp.service');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const registerUser = async (req, res) => {
  // Check if the input is valid 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array())
    return res.status(400).json({
      success:false,
      errors: errors.array(),
    });
  }

  // Now, the data from the request is valid
  const { fullname, email, password } = req.body;

  try {
    // Check if user already exists
    const isUser = await userModel.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        success: false,
        message:
          'User already registered with this email! Login to continue or register with a different Email',
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the password
    const hashedPassword = await userModel.hashPassword(password);

    // Create the new user
    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
      otp: otp,
      otp_expiry: Date.now() + 2*60*1000, // OTP expires in 2 minutes
    });

    // Send the OTP email
    const MailSentSuccess = await sendOTP(email, fullname, otp);
    if (!MailSentSuccess) {
      return res.status(400).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.',
      });
    }

    // Respond with success message
    res.status(200).json({
      success: true,
      message:
        'User registered successfully. Please check your email for the OTP to verify your account.',
        data:user.otp
    });
  } catch (error) {
    console.error(error, error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again later!',
    });
  }
};

const emailVerification=async(req,res)=>{
  try {
    const{email,otp}=req.body
    if(!email){
      throw new Error("email not found")
    }

    // find the user with existing mail
    const user=await userModel.findOne({email:email});
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }

    const isValidOtp= otp===user.otp;
    const isNotExpired=Date.now()<user.otp_expiry;
    if(isValidOtp&&isNotExpired){
        user.isVerified=true
        user.otp=null,
        user.otp_expiry=null
        await user.save();

        const token=jwt.sign({email:user.email,_id:user._id},process.env.JWT_SECRET,{expiresIn:"24h"})

        return res.status(200).json({
          success:true,
          message:"Email verified successfully✅",
          token:token
        })

      
    } else if(!isValidOtp){
      return res.status(400).json({
        success:false,
        message:"Invalid OTP"
      })
    }
    else{
      return res.status(400).json({
        success:false,
        message:"OTP Expired"
      })
    }
    
  } catch (error) {
    console.error("Some Error occoured while verifying emial",error.message)
    return res.status(500).json({
      success:false,
      message:"Error Occoured while verifying email please try again later!!"+error.message
    })
  }
}

const resendOTP=async(req,res)=>{
try {
  const {email}=req.body
if(!email){return res.status(400).json({
  success:false,
  message:"Email not found! Try again"
})}

const user=await userModel.findOne({email:email})

if(!user){
  return res.status(400).json({
    success:false,
    message:"User not found!! Register Again"
  })
}

const isValidOtp= user.otp_expiry>Date.now();
if(isValidOtp){
  return res.status(400).json({
    success:false,
    message:"Please wait for 2 min before requesting a new otp"
  })
} 
const otp=Math.floor(100000+Math.random()*900000).toString()
user.otp=otp;
user.otp_expiry=Date.now()+ 120000
await user.save()
const MailSentSuccess = await sendOTP(email, user.fullname, otp);
if (!MailSentSuccess) {
  return res.status(400).json({
    success: false,
    message: 'Failed to send verification email. Please try again later.',
  });
}

return res.status(200).json({
  success:true,
  message:"OTP sent successfully✅"
})


} catch (error) {
  console.error("Error encountered : ",error.message)
  res.status(500).json({
    success:false,
    message:"Something went wrong!! try again later",
    data:otp
  })
  
}
}

const loginUser=async(req,res)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array())
    return res.status(400).json({
      success:false,
      errors: errors.array(),
    });
  }
  const {email,password}=req.body
  try {
    //find the user 
    const user= await userModel.findOne({email:email})

    if(!user){
      return res.status(400).json({
        success:false,
        message:"Invalid Email or Password"

      })
    }

    if(!user.isVerified){
      return res.status(400).json({
        success:false,
        verificationPending:true,
        message:"Please verify your email before logging in "
      })
    }

    // now the user exists and is verified -> so compare the password
    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
      return res.status(400).json({
        success:false,
        message:"Invalid Email or Password"
      })
    }
    // here the password is valid so we need to assign the token 
    const token=jwt.sign({_id:user._id,email:email},process.env.JWT_SECRET,{expiresIn:"24h"})

    return res.status(200).json({
      success:true,
      message:"Login Successful",
      token:token
    })

    
  } catch (error) {
    console.error("Error Encountered:"+error)
    return res.status(500).json({
      success:false,
      message:"something went wrong!"
      })
    }

 
}

const forgotPassword=async(req,res)=>{
const errors=validationResult(req);
if(!errors.isEmpty()){
  return res.status(400).json({
    success:false,
    errors:errors.array(),
  })
}
// no errro-> recieveed a valid email so extract it from req
const {email}=req.body

// check if user exists 
try {
  const user=await userModel.findOne({email:email})

  // check if user exists
  if(!user){
    return res.status(400).json({
      success:false,
      message:"User Not Found!"
    })
  }

  // now the user exists 
  // we will use reset token and set its expiry and store against the user

  const reset_token= jwt.sign({_id:user._id,email:user.email},process.env.RESET_PASS_SECRET,{expiresIn:"1h"})

  user.reset_token=reset_token;
  user.reset_token_expiry=Date.now()+1*60*60*1000
  await user.save();

  const resetURL=`${process.env.FRONTEND_URL}/reset-password/${reset_token}`
  

} catch (error) {
  console.error("Error encountered in forgot password controller", error)
  return res.status(500).json({
    success:false,
    message:error
  })
}
}
module.exports = { registerUser, 
  emailVerification,
  resendOTP,
  loginUser,
  forgotPassword,
 };