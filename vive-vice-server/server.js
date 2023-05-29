const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const model = require('./db');
const video_db = require('./db2');
const Vizionare_add = require('./db3');
const like_add = require('./db1');
const cometariu_add = require('./db4');
const uuid = require('uuid');
const { spawn } = require('child_process');
const axios = require('axios');
dotenv.config();


dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL).then(() => {
    console.log('mongodb connected');
}).catch((e) => {console.log(e)});


const verifyJWT = (req, res, next) => {
    if(!req.headers['x-access-token']){
        res.send("Ai nevoi sa te logezi");
        res.json({token: false});
    }
    else{
        const token = req.headers['x-access-token'].split(" ")[1];
        jwt.verify(token,process.env.MY_SECRET_KEY,(err,data)=>{
            if(err){
                res.json({auth: false})
            }else{
                req.username = data.username;
                req.user_id = data.user_id;
                next();
            }
        });
    }
}

app.post('/add_view',async(req,res)=>{
    if(req.headers['x-access-token']){
    const token = req.headers['x-access-token'].split(" ")[1];
        try{
        jwt.verify(token,process.env.MY_SECRET_KEY,(err,data)=>{
                user_id = data.user_id;
        });
        }catch{
            user_id = "";
        }
    }else{
        user_id = "";
    }
    if(req.body.id){
        const id = req.body.id;
        console.log(id)
        await Vizionare_add.insertMany({video_id: id,user_id:user_id||""})
    }
})
app.post("/add_like",verifyJWT,async(req,res)=>{
        if(req.body.id && req.user_id){
            const id = req.body.id;
            console.log(id)
            await like_add.insertMany({video_id: id,user_id:req.user_id})
        }
})
app.post('/add_comentariu',verifyJWT,async(req,res)=>{
        if(req.body.id && req.user_id && req.body.comentariu){
            const comentariu = req.body.comentariu;
            const video_id = req.body.id;
            const user_id = req.body.user_id;
            await cometariu_add.insertMany({video_id: video_id,user_id:user_id,comentariu: comentariu})
        }
})
app.post('/change_data',verifyJWT,async(req, res) => {
    if(req.body.username){
        try{
        console.log(req.body.username)
        const username = req.body.username;
        
        const existingUser = await model.findOne({ username: username });
        if (existingUser) {
          res.json({ check: false });
        } else {
          await model.updateOne({ user_id: req.user_id }, { $set: { username: username } });
          res.json({ check: true });
        }
    
        }catch{
            res.json({check: false}); 
        }
    }else if(req.body.email){
        try{
        const email = req.body.email;
        await model.updateOne({user_id: req.user_id},{$set:{email: email}})
        res.json({check: true});
        }catch{
            res.json({check: false});
        }
    }else if(req.body.telefon){
        try{
        const telefon = req.body.telefon;
        await model.updateOne({user_id: req.user_id},{$set:{telefon: telefon}});
        res.json({check: true});
        }catch{
            res.json({check: false});
        }
    }else{
        res.json({check: false});
    }
})

app.post('/api/request',(req, res)=>{
    res.json({auth:true, username:req.username});
})

app.get("/date_utilizator",verifyJWT,async(req, res)=>{
    const rest = await model.findOne({user_id: req.user_id})
    res.json({username: rest.username||"", email:rest.email||"",telefon: rest.telefon||""})
})

app.post('/verificare_parola',verifyJWT,async(req, res)=>{
    const parola = req.body.password;
    const result = await model.findOne({user_id: req.user_id})
    const verificare = await bcrypt.compare(parola,result.password);
    if(!verificare){
        res.json({verificare:verificare,error:true});
    }else{
    res.json({verificare:verificare,error:false});
    }
})

app.get('/api',cors(),(req,res)=>{
    res.json({"users":["useOne","useTwo"]});
})
const storage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        console.log(file);
        cb(null,Date.now() + path.extname(file.originalname));
    }

})
const upload = multer({storage: storage});

app.post('/api/upload', [verifyJWT,upload.single('video')], async(req, res) => {
  const videoFile = req.file;
  const description = req.body.description;
  const image = req.body.thumbnail;
  console.log(image);

  date = new Date();
  const video = {
    filename: videoFile.filename,
    description: description,
    username:  req.username,
    user_id: req.user_id,
    id: uuid.v4(),
    time: date.getTime(),
    thumbnail: image
  };
   
  try{
  await video_db.insertMany([video]);
  res.json({success: true})
  }catch(e){
    res.json({success: false})
  }
});

app.post('/video_data',verifyJWT,async(req, res) => {
    if(req.body.filename){
    const result = await Vizionare_add.find({video_id: req.body.filename});
    const result1 = await like_add.find({video_id: req.body.filename});
    res.json({views: result.length||0, like: result1.length||0});
    }
});


////
app.post('/api/video/data',async(req, res) => {
    id = req.body.id;
    if(id){
        user_id = ""
        isheader = req.headers['x-access-token']? true : false
        if(isheader){
            const token = req.headers['x-access-token'].split(" ")[1];
            jwt.verify(token,process.env.MY_SECRET_KEY,(err,data)=>{
                    user_id = data.user_id;
            });
        }   
            const like_user = await like_add.findOne({user_id: user_id})? 1 : 0
            let like = await like_add.find({video_id: id})
            like = like.length
            let view = await Vizionare_add.find({video_id: id})
            view = view.length
            const comenatri = [];
            const coment = await cometariu_add.find({video_id: id})
            let des = await video_db.findOne({id: id})
            let descriere = des.description
            if(coment){
            for(let i = 0; i < coment.length; i++){
                console.log(coment[i].user_id)
                const result = await model.findOne({user_id: coment[i].user_id});
                console.log(result)
                comenatri.push({comentariu: coment[i].comentariu, user: result.username})
            }
            }
            if(like){
            res.json({like_user: like_user,like: like,view: view,comentari: comenatri.reverse(),descriere: descriere})
            }else{
                res.json({like_user: false,like: like,view: view,comentari: comenatri.reverse(),descriere: descriere}) 
            }
        
    }

    
})
///


app.post('/api/add_coment',verifyJWT,async(req,res)=>{
    const comentariu = req.body.comentariu;
    const id = req.body.id;
    const user_id = req.user_id;
    await cometariu_add.insertMany({video_id: id,user_id: user_id,comentariu: comentariu});
    res.json({status: true})
})


///

app.post("/api/like",verifyJWT,async(req,res)=>{
    const result = await like_add.findOne({user_id: req.user_id})? 1 : 0
    console.log(req.body.id)
    if(result){
    await like_add.deleteOne({user_id: req.user_id})
    res.json({success:true})
    }else{
        const id = req.body.id;
        if(id){
            await like_add.insertMany({video_id: id,user_id: req.user_id})
            res.json({success:true})
        }
    }
})

///

app.post('/api/video_update_descriere',verifyJWT,async(req,res)=>{
    if(req.body.descriere && req.body.id && req.user_id){
        const id = req.body.id
        const descriere = req.body.descriere;
        const result = await video_db.updateOne({id:id},{$set:{description: descriere}})
        const acknowledgement = result. acknowledged;
        if(acknowledgement){
            res.json({success: true, error: "",token: true})
        }
        else{
            res.json({success: false, error: "A aparut o eroare in timpul modificari",token: true})
        }
    }
})

app.post('/api/delete_video',verifyJWT,async(req,res)=>{
    const id = req.body.id;
    const result = await video_db.findOne({id:id});
    const videoPath = path.join(__dirname, 'uploads', result.filename);
    console.log(videoPath);
    fs.unlink(videoPath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
    });
    await Vizionare_add.deleteMany({id: id});
    await like_add.deleteMany({id: id});
    await video_db.deleteMany({id: id});
    res.json({success: true});
})

app.get('/api/get_video',verifyJWT,async(req,res) =>{
    const nume_video = await video_db.find({user_id: req.user_id});
    console.log(nume_video);
    const video_num = []
    for (let i = 0; i < nume_video.length; i++) {
        video_num.push({filename: nume_video[i].id, description: nume_video[i].description});
    }
    const result = await model.findOne({user_id: req.user_id})

    console.log(video_num)
    res.send(JSON.stringify({video_num:video_num,username:result.username}));
});

app.get('/verificare_token',verifyJWT,async(req,res)=>{
    res.json({auth: true})
})
///

app.get('/api/video/:video',verifyJWT, async(req, res) => {
    if(req.params.video){
        const par_name = await video_db.findOne({id: req.params.video});
        console.log(par_name.filename)
        const videoPath = path.join(__dirname, 'uploads', par_name.filename);
        res.setHeader('Content-Type', "video/*");
        res.sendFile(videoPath);
    }
    else{
        console.log('nu este')
    }
});


///

app.get('/api/video_geter/:video', async (req, res)=>{
    if(req.params.video){
        const par_name = await video_db.findOne({id: req.params.video});
        console.log(par_name.filename)
        const videoPath = path.join(__dirname, 'uploads', par_name.filename);
        res.setHeader('Content-Type', "video/*");
        res.sendFile(videoPath);
    }
});

///
app.post('/insert_password',verifyJWT,async(req,res)=>{
    if(req.body.password){
        try{
        const hash = await bcrypt.hash(req.body.password,10);
        await model.updateOne({user_id: req.user_id},{$set:{password:hash}})
        res.json({success:true})
        }catch(err){
            res.json({success:false})
        }
    }
    else{
        res.json({success:false})
    }
});

app.get('/backgroud',async(req,res)=>{
    const videoPath = path.join(__dirname, 'img', "backgroud.mp4");
    res.setHeader('Content-Type', "video/*");
    res.sendFile(videoPath);
})

app.post('/autentificare',async(req,res)=>{
    const {username,password,token} = req.body;
    if (username === "" || password === ""){
        res.json({error:"Nu este introdus username-ul sau parola."})
    }else{
        const googleVerify = `https://www.google.com/recaptcha/api/siteverify`;
        const response = await axios.post(googleVerify, null, {
            params: {
              secret: process.env.CAPCHEA_SECRET,
              response: token,
            },
          });
      
        const { success } = response.data;
        console.log(success);
        if(success === false) {
            res.json({error: "Captcha-ul nu a fost completat"})
        }
        else{
        const hashpassword = await bcrypt.hash(password,10);
        const user_id = uuid.v4()
        const date = {username:username,password:hashpassword,user_id: user_id,};
        const check = await model.findOne({username: username}) || "nun";
            if(check === "nun"){
                await model.insertMany([date]);
                const token = jwt.sign({user_id:user_id},process.env.MY_SECRET_KEY,{expiresIn: "1h"});
                res.json({token: token});
            }else{
                res.json({error:'Username-ul este folosit'});
            }
        }
       
    }
});

app.post("/log-check",async(req,res)=>{
    const {username,password,token} = req.body;
    if (username === "" || password === ""){
        res.json({error:"Nu este introdus username-ul su parola."})
    }
    else{
        const googleVerify = `https://www.google.com/recaptcha/api/siteverify`;
        const response = await axios.post(googleVerify, null, {
            params: {
              secret: process.env.CAPCHEA_SECRET,
              response: token,
            },
          });
      
        const { success } = response.data;
        console.log(success);
        if(success === false) {
            res.json({error: "Captcha-ul nu a fost completat"})
        }
        else{
        const check = await model.findOne({username: username})|| "";
        const isEqual = await bcrypt.compare(password, check.password);
        if(isEqual){
            const token = jwt.sign({user_id: check.user_id},process.env.MY_SECRET_KEY,{expiresIn: "1h"});
            res.json({token: token});
        }else{
            res.json({erorr: "Parola este gresita"})
        }
        }

    }
})

//////

function captureScreenshotFromVideo(inputFilePath, timestamp) {
    return new Promise((resolve, reject) => {
      // FFmpeg command
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputFilePath,
        '-ss', timestamp,
        '-vframes', '1',
        '-f', 'image2pipe',
        '-c:v', 'png',
        '-'
      ]);
  
      // Buffer to store the captured screenshot data
      const buffers = [];
  
      // Capture the output data
      ffmpeg.stdout.on('data', (data) => {
        buffers.push(data);
      });
  
      // Handle FFmpeg errors
      ffmpeg.on('error', (error) => {
        reject(error);
      });
  
      // Handle process completion
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          // Concatenate the captured data and resolve the promise
          const screenshotData = Buffer.concat(buffers);
          resolve(screenshotData);
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
    });
  }


///////
function captureScreenshotFromVideo(inputFilePath, timestamp) {
    return new Promise((resolve, reject) => {
      // FFmpeg command
      const ffmpeg = spawn('ffmpeg', [
        '-i', inputFilePath,
        '-ss', timestamp,
        '-vframes', '1',
        '-f', 'image2pipe',
        '-c:v', 'png',
        '-'
      ]);
  
      // Buffer to store the captured screenshot data
      const buffers = [];
  
      // Capture the output data
      ffmpeg.stdout.on('data', (data) => {
        buffers.push(data);
      });
  
      // Handle FFmpeg errors
      ffmpeg.on('error', (error) => {
        reject(error);
      });
  
      // Handle process completion
      ffmpeg.on('close', (code) => {
        if (code === 0) {
          // Concatenate the captured data and resolve the promise
          const screenshotData = Buffer.concat(buffers);
          resolve(screenshotData);
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
    });
  }
/////////
app.get('/api/video/front/:video',async(req,res)=>{
    if(req.params.video){
        const video = req.params.video;
        const file = await video_db.findOne({id: video});
        const filename = file.filename;
        videoPath = path.join(__dirname, './uploads', filename);
        const timestamp = '00:00:05';
        captureScreenshotFromVideo(videoPath , timestamp)
        .then((screenshotData) => {
            res.send(screenshotData);
        })
        .catch((error) => {
        console.error('Error capturing screenshot:', error);
        });
    }
})

///////

app.post('/search', async(req,res)=>{
    const query = req.body.query
    const pattern = new RegExp(`.*${query}.*`, 'i');
    const resu = await video_db.find({description: pattern})
    const result = [];
    for(let i = 0; i < resu.length; i++) {
        const des = resu[i].id;
        console.log(des)
        result.push(des);
    }
    res.json({result: result});
})

///////
app.listen(5000,()=>{console.log('listening on port')});