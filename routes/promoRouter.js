const express = require('express')
const bodyParser = require('body-parser')

const promoRouter = express.Router()

promoRouter.use(bodyParser.json())

promoRouter.route('/')
    .all((req, res, next) => {
        res.status = 200;
        res.setHeader('Content-Type', 'text/plain');
        // res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_FRONTEND)
        next();
    })

    .get((req, res, next) => {
        res.end('Will send all the promotions to you')
    })

    .post((req, res, next) => {
        res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description)
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not suported on promotions')
    })

    .delete((req, res, next) => {
        res.end('Deleting all the promotions')
    })

promoRouter.route('/:promoId')
    .all((req, res, next) => {
        res.status = 200;
        res.setHeader('Content-Type', 'text/plain');
        // res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_FRONTEND);
        next();
    })

    .get((req, res, next) => {
        res.end('Will send the promotion: ' + req.params.promoId + ' to you')
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not suported on /dishes/'+req.params.dishId)
    })

    .put((req, res, next) => {
        res.end('Will update the promotion: ' + req.params.promoId)
    })

    .delete((req, res, next) => {
        res.end('Deleting the promotion: '+ req.params.promoId)
    })

    module.exports = promoRouter