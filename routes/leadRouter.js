const express = require('express')
const bodyParser = require('body-parser')

const leadRouter = express.Router()

leadRouter.use(bodyParser.json())

leadRouter.route('/')
    .all((req, res, next) => {
        console.log(process.env.REACT_APP_FRONTEND)
        res.status = 200;
        res.setHeader('Content-Type', 'text/plain');
        // res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_FRONTEND);
        next();
    })

    .get((req, res, next) => {
        console.log(process.env.REACT_APP_FRONTEND)
        res.end('Will send all the leads to you')
        
    })

    .post((req, res, next) => {
        res.end('Will add the lead: ' + req.body.name + ' with details: ' + req.body.description)
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not suported on leads')
    })

    .delete((req, res, next) => {
        res.end('Deleting all the leads')
    })

leadRouter.route('/:leadId')
    .all((req, res, next) => {
        res.status = 200;
        res.setHeader('Content-Type', 'text/plain');
        // res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_FRONTEND);
        next();
    })

    .get((req, res, next) => {
        res.end('Will send the lead: ' + req.params.leadId + ' to you')
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not suported on /leaders/'+req.params.leadId)
    })

    .put((req, res, next) => {
        res.end('Will update the leader: ' + req.params.leadId)
    })

    .delete((req, res, next) => {
        res.end('Deleting the leader: '+ req.params.leadId)
    })

    module.exports = leadRouter