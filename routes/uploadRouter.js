const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const multer = require('multer')

const cors = require('./cors')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const imageFileFilter = (req, file, cb) => {
    //added case sensitive
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('You can upload only image files!'), false)
    }
    cb(null, true)
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter })

const uploadRouter = express.Router()

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not suported on /imageUpload')
    })

    //TODO: Why only small files are accepted? in postman: Error: read ECONNRESET

    .post(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin,
        upload.single('imageFile'), (req, res, next) => {
            console.log(req)
            console.log(res)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(req.file)

        })
    .put(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not suported on /imageUpload')
    })
    .delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not suported on /imageUpload')
    })

module.exports = uploadRouter