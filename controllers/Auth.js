const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.signup = async(req,res) => {
    try{
        const {name,email,password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                sucess : false,
                message : "Email Id already exists."
            });
        }

        //now we hash the password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }catch(err){
            return res.status(500).json({
                success:false,
                message : "Error in hashing the password"
            })
        }

        const user = await User.create({
            name,email,password:hashedPassword
        })

        return res.status(200).json({
            success:true,
            message : "User created successfully"
        })

    }catch(err){
        console.error(err)
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again later."
        })
    }
}

exports.login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Enter the details carefully"
            })
        }

        let checkedUser = await User.findOne({email});
        if(!checkedUser){
            return res.status(401).json({
                success : false,
                message : "You need to signup first!"
            })
        }

        const payload = {
            email:checkedUser.email,
            id:checkedUser._id
        }

        //check if the password is correct
        if(await bcrypt.compare(password,checkedUser.password)){
            //password matched
            let token = jwt.sign(payload,process.env.SECRET_KEY,
                                {
                                    expiresIn:"2h"
                                });
            checkedUser = checkedUser.toObject();
            checkedUser.token = token;
            checkedUser.password = undefined;

            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true
            }

            res.cookie("token",token,options).status(200).json(
                {
                    success:true,
                    token,
                    checkedUser,
                    message : "User logged in successfully"
                }
            )
        }else{
            return res.status(403).json({
                success:false,
                message : "Password does not match"
            })
        }


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"User couldn't be logged in.Try again later"
        })
    }
}