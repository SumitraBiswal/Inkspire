import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";


export const register = async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.json({success:false,message:'data cannot be fetch or missing details , please try again'})
    }
    try{

        const existingUser= await userModel.findOne({email})
        if (existingUser){
            return res.json({success:false , message:'user already exist'});
        }
       const hashedPassword = await bcrypt.hash(password, 10);
       const user=new userModel({name , email , password:hashedPassword});
       await user.save();

       const token= jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '10d'});

       res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV ==='production',
        sameSite:process.env.NODE_ENV ==='production' ? 'none':'lax',
        maxAge: 10*24*60*60*1000
       });
       //const verifyLink=`https://yourdomain.com/verify/${token}`;
       
       //sending welcome email
       const mailOption={
           from:process.env.SENDER_EMAIL,
           to:email,
           subject : "welcome to our authenciation mern project",
      
    
           text:`Welcome to INKSPIRE website . Your account has been created with email id:${email}`,
       };

       await transporter.sendMail(mailOption);


       return res.json({success:true ,message:"Login Successful",
            user:{id:user._id,name:user.name,email:user.email},token:token,});

    }catch(error){
   res.json({success:false, message:error.message})
    }
}
      
export const login= async (req,res)=>{
    const{email ,password }=req.body;
    if(!email || !password){
        return res.json ({success:false , message: "email and password are required"})
    }
    try{
     const user = await userModel.findOne({email});

     if(!user){
        return res.json({success:false , message: 'invalid email , try again after sometime either add correct emailaddress'})
     }
     const isMatch= await bcrypt.compare(password,user.password)
     if(!isMatch){
        return res.json({success:false , message: 'invalid password , enter correct password or try after sometime!'})
     }
         const token= jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '10d'});

       res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV ==='production',
        sameSite:process.env.NODE_ENV ==='production' ? 'none':'lax',
        maxAge: 10*24*60*60*1000
       });

        return res.json({success:true ,message:"Login Successful",
            user:{id:user._id,name:user.name,email:user.email},token:token,});

    }catch (error){
      res.json({success:false, message:error.message})
    }
}
export const logout = async (req,res)=>{
    try{
  res.clearCookie('token',{
      httpOnly:true,
        secure:process.env.NODE_ENV ==='production',
        sameSite:process.env.NODE_ENV ==='production' ? 'none':'strict',
  })

  return res.json ({success:true, message:'Logged Out'})
    } 
    catch(error){
        res.json({success:false, message:error.message})
    }
}


//send verfication otp to the user's email
export const sendVarifyOtp = async (req,res)=> {
    try{
          const {userId}=req.body;

          const user= await userModel.findById(req.userId);
          if (user.isAccountVerified){
            return res.json({success:false , message:"Account already verfied"})
          }
          //if account is not verfied then send otp in the email

    const otp = String( Math.floor( 100000+ Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24*60*60*1000

    await user.save();

    const mailOption = {
         from:process.env.SENDER_EMAIL,
           to:user.email,
           subject : "Account Varification OTP",
           text:`Your OTP is ${otp}.
           Verify is Your Account using this otp
           and donot share it with anyone . we'll never ask for it outside an official platfrom.
           
           thanks,
           the inkspire team`,
    }
    await transporter.sendMail(mailOption);
    res.json({success:true , message:"Verification otp sent on Email"})

    }catch(error){
          res.json({success:false, message:error.message})
    }
}

//verify the email ussing otp //result -is accountverified is true or false
export const verifyEmail = async(req,res)=>{
    const { otp}=req.body;

    if( !otp){
        return res.json({success:false, message:"missing details"});
    }
    try{
        const userId=req.userId;
          const user = await userModel.findById(req.userId);

          if(!user){
              return res.json({success:false, message:"User not Found"});
          }

          if(user.verifyOtp=== ""|| user.verifyOtp !== otp){
          return res.json({success:false, message:"Invalid otp"});
          }
          if(user.verifyOtpExpireAt < Date.now()){
              return res.json({success:false, message:"Otp Expired"});
          }
          user.isAccountVerified = true;
          user.verifyOtp='';
          user.verifyOtpExpireAt = 0;

          await user.save();
        return  res.json({success:true, message:"Email verified successfully!"});
    }catch (error){
          res.json({success:false, message:error.message})
    }
}

//check is user is authenticated or logged

export const isAuthenticated = async (req,res)=>{
    try{
        const user = await userModel.findById(req.userId).select("-password");
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
         return  res.json({success:true,user:user});
    }catch(error){
        res.json({success:false, message:error.message})
    }
}

//send password reset otp in mail

export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false, message:"Email is required"});
    }
    try{
      
        const user = await userModel.findOne({email});
        if(!user){
           return res.json({success:false, message:"User Not Found"});

          
        }
          const otp = String( Math.floor( 100000+ Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15*60*1000

    await user.save();

    const mailOption = {
         from:process.env.SENDER_EMAIL,
           to:user.email,
           subject : "Password Reset OTP",
           text:`Your OTP for resetting your password is ${otp}.
           
           Use this OTP to procced with resetting your password.
           and donot share it with anyone . we'll never ask for it outside an official platfrom.

           
           thanks,
           the inkspire team`,
    };

    await transporter.sendMail(mailOption);
    return res.json({success:true , message:"otp send to your email"});

    }catch(error){
        res.json({success:false, message:error.message})
    }
}

//verify the otp and reset the password

export const resetPassword = async(req,res)=>{
    const {email, otp , newPassword}=req.body;
    if(!email || !otp || !newPassword){
        return res.json({success:false ,message:"Email ,Otp ,NewPassword are required"});
    }try{

        const user = await userModel.findOne({email});
        if(!user){
                res.json({success:false, message:"user not found"});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp ){
              return res.json({success:false ,message:"Invalid Otp"});
        }

       if(user.resetOtpExpireAt < Date.now()){
          return res.json({success:false ,message:"Otp Expired"});
       }
    
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.resetOtp = '';
      user.resetOtpExpireAt = 0;

      await user.save();

        return res.json({success:true ,message:"Password hasbeen reset successfully"});
    }catch(error){
       res.json({success:false, message:error.message})
    }
}