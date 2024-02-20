import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'

export const registerController = async (req, res, next) => {
    try {
        const {name, email, password, phone, address } = req.body;
        if (!name) {
            return res.send({error: "Name is Required"})
        }
        if (!email) {
            return res.send({error: "email is Required"})
        }
        if (!password) {
            return res.send({error: "password is Required"})
        }
        if (!phone) {
            return res.send({error: "phone No is Required"})
        }
        if (!address) {
            return res.send({error: "address is Required"})
        }

        // Existing user check
        const existingUser = await userModel.findOne({email});
        // existing user
        if (existingUser) {
            return res.status(200).send({
                success:true,
                message:"This email already exist pls try with another one "
            })
        }

        // Register User
        const hashedPassword = await hashPassword(password);
        // save user
        const user = await new userModel({name, email, phone, address, password:hashedPassword}).save();
        res.status(201).send({
            success:true,
            message:"User register Successfully",
            user  
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Registration",
            error
        })
    }
};


export const loginController = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success:false,
                message:"some credential are invalid"
            })
        }
        // check user
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(404).send({
                success:false,
                message:"User not exist"
            })
        }
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).send({
                success:false,
                message:"invalid password"
            })
        }
        // create token
        const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(200).send({
            success:true,
            message:"login successful",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went Wrong try again with proper credentials",
            error
        })
    }
}