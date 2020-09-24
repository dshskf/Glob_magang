const express = require('express')
const http = require('http')
const multer = require('multer')
const bp = require('body-parser')
const path = require('path')
const fs = require('fs')
const { dir } = require('../path')

const app = express()
const server = http.createServer(app)

const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = dir + req.body.company_id
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        cb(null, dir + req.body.company_id)
    },
    filename: (req, file, cb) => {
        cb(null, req.body.imageName)
    }
})

const filefilter = (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use((req, res, next) => { //To allow cors(different domain)
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE");
    res.setHeader('Access-Control-Allow-Headers', "Content-Type,Authorization");
    next()
})

app.use(bp.json({ limit: '10mb' }));
app.use(bp.urlencoded({ limit: '10mb', extended: true }));
app.use('/images', express.static(path.join(dir)));

// app.use(multer({ storage: filestorage, fileFilter: filefilter }).single('image'))
let upload = multer({ storage: filestorage, fileFilter: filefilter })

app.post('/update', upload.single('image'), (req, res, next) => {
    if (req.body.oldPictureName !== req.body.imageName) {
        fs.unlink(dir + req.body.company_id + "\\" + req.body.oldPictureName, (err) => err)
    }
    return res.status(200).json({
        path: "http://localhost:1234/images/" + req.body.company_id + "/" + req.body.imageName,
        name: req.body.imageName
    })    
})

app.post('/', upload.single('image'), (req, res, next) => {
    return res.status(200).json({
        path: "http://localhost:1234/images/" + req.body.company_id + "/" + req.body.imageName.replace(" ", "-"),
        name: req.body.imageName
    })
})

server.listen(1234, () => {
    console.log("Server running...")
})