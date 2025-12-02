import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cloudinary from "./cloudinaryConfig.js"

dotenv.config()

const app=express()
//app.use(cors({ origin: "http://localhost:5173" }))
app.use(cors({ origin:"https://fm06-recipe-backend.vercel.app/api"}))
app.use(cors())

app.use(express.json({limit:"5mb"}))

app.post('/api/uploadImage', async (req,resp)=>{
    try {
        const {image} = req.body
        
        const uploadResponse = await cloudinary.uploader.upload(image,{folder:"recipes"})
        resp.json({
            serverMsg:"Image uploaded!",
            url:uploadResponse.secure_url,
            public_id:uploadResponse.public_id
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({serverMsg:"Upload failed!"})
        
    }
})

app.post('/api/deleteImage', async (req,resp)=>{
    try {
        const {public_id} = req.body
        console.log("public_id kliens oladlrol" ,public_id);
        const deleteResult = await cloudinary.uploader.destroy(public_id)
        if(deleteResult.result=="ok") resp.json({serverMsg:"Image delete successful!"})
        else resp.status(400).json({serverMsg:"Image not found!"})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({serverMsg:"Failed to delete image!"})
    }
})

const port=process.env.PORT|| 5050
app.listen(port,()=>console.log(`Server listening on port ${port}`))