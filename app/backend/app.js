import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import {MongoDatabase} from './database/db.js';
import bcyrpt from 'bcrypt';
import fs from 'fs/promises'

const app = express();
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const user = req.query.user
        const folder = `./upload/${user}`

        fs.mkdir(folder,{recursive : true})
        cb(null,folder)
    },
    filename : (req,file,cb) => {
        const unique = Date.now() + '-' + file.originalname.replace(/\s/g, '-')

        cb(null, unique)
    }
})
const upload = multer({storage : storage})
// const mongo = new MongoClient('mongodb://localhost:27017/')
const data = await MongoDatabase()

// const hash1 = await bcyrpt.hash('pass123', 10)
// console.log(hash1)
// const isSame = await bcyrpt.compare('pass123', hash1)
// console.log(isSame)

app.use(cors({
    origin : 'http://localhost:5173'
}))

app.use('/upload', express.static('upload'))

app.post('/api/sendFiles',upload.fields([
    {name : 'Judul'},
    {name : 'startDate'},
    {name : 'endDate'},
    {name : 'image'},
    {name : 'username'},
    {name : 'color'}
]), async (req, res) => {
    
    const collection = data.collection('trip_info_database');

    await collection.insertOne({
        "Judul" : req.body.Judul,
        "TanggalBerangkat" : req.body.startDate,
        "TanggalPulang" : req.body.endDate,
        "LinkFoto" : req.files.image ? req.files.image[0].filename : null,
        'Username' : req.body.username,
        "Warna" : req.body.color
    })

    res.status(200).send()

})

app.post('/api/isLogin',upload.fields([
    {name : 'username'},
    {name : 'password'}
]), async (req, res) => {
    const user_collection = await data.collection('user_data').findOne({username : req.body.username})

    if(!user_collection){
        res.status(400)
    }

    // console.log('user ditemukan', user_collection)

    const isMatch = await bcyrpt.compare(req.body.password, user_collection.password)

    if(!isMatch){
        res.status(400)
    }

    // console.log('password sesuai', isMatch)

    res.send().status(200)
})

app.post('/api/createUser' , upload.fields([
    {name : 'getusername'},
    {name : 'getpassword'}
]), async (req, res) => {

    let hash = await bcyrpt.hash(req.body.getpassword, 10);
    const collection = await data.collection('user_data');

    let sameUser = await collection.findOne({username : req.body.getusername})

    if(sameUser){
        res.status(400).send({message : 'Username sudah ada'})
    }

    collection.insertOne({
        username : req.body.getusername,
        password : hash
    })

    res.status(200).send()
})

app.get('/api/getData', async (req,res) => {
    const collection = data.collection('trip_info_database');

    let datas = await collection.find({
        Username : req.query.username
    }).toArray()

    if(datas.length === 0) {
       return res.status(400).send()
    }

    return res.status(200).json(datas)
})

app.get('/api/removePhoto', async (req, res) => {
    const collection = data.collection('trip_info_database');

    await fs.unlink(`./upload/${req.query.user}/${req.query.photo}`)

    await collection.updateOne({
        _id : new ObjectId(req.query.id)
    }, {
        $set : {LinkFoto : null}
    })

    res.status(200).send()
})

app.post('/api/saveBlock', upload.any(), async (req, res) => {

    let jsonData = JSON.parse(req.body.blocks)

    const collection = data.collection('time_block_data')

    // Jika block kosong
    if (jsonData.length === 0) {

        await collection.deleteMany({
            trip_id: req.body.tripId
        });

        return res.status(200).send();
    }


    for (const block of jsonData) {

        const fileName = req.files.find(f => f.fieldname === `photo_${block.id}`)
        const filePath = fileName ? `http://localhost:3000/upload/${req.query.user}/${fileName.filename}` : null

        const exist = await collection.findOne({
            trip_id: req.body.tripId,
            id: block.id
        });

        if(!exist){
            await collection.insertOne({
                username: req.query.user,
                id: block.id,
                time: block.time,
                activity: block.activity,
                description: block.description,
                trip_id: req.body.tripId,
                photo : filePath
            });
        }else {
            const updateData = {
                time: block.time,
                activity: block.activity,
                description: block.description,
            }

            // hanya update foto kalau ada file baru dikirim
            if (filePath) {
                updateData.photo = filePath
            }

            await collection.updateOne(
                { trip_id: req.body.tripId, id: block.id },
                { $set: updateData }
            )
        }

    }

    res.status(200).send();
    
})

app.get('/api/getBlock', async (req,res) => {
    const collection = data.collection('time_block_data')

    let datas = await collection.find({
        trip_id : req.query.id
    }).toArray()

    if(datas.length !== 0) {
        res.status(200).json(datas)
    }
})

app.get('/api/removeBlock', async (req,res) => {
    const collection = data.collection('time_block_data')

    try{
        await collection.deleteOne({
            trip_id : req.query.trip_id,
            id : Number(req.query.id)
        })

        res.status(200).send()
    }catch(err) {
        res.status(404).send()
    }
})

app.listen(3000)