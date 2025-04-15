const { PrismaClient }= require('@prisma/client');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const prisma = new PrismaClient();

exports.signup=async(req,res)=>{
    const {email, password, role} = req.body;

    const existingUser =  await prisma.user.findUnique({
        where: { email },
    });
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword=await bcrypt.hash(password,10);

    const user=await prisma.user.create({
        data:{
            email,
            password:hashedPassword,
            role
        }
    });
    const token=generateToken(user);
    res.status(201).json({token});
};

exports.login=async(req,res)=>{
    const{email,password}=req.body;

    const user=await prisma.user.findUnique({
        where:{email}
    });
    if(!user){
        return res.status(400).json({message:"Invalid credentials"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }
    const token=generateToken(user);
    res.status(200).json({token});
}

exports.dashboard=async(req,res)=>{ 
    res.status(200).json({message:`Welcome to the Dashboard ${req.user.role}` });
}