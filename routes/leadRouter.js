const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')

const Leaders = require('../models/leaders')

const leadRouter = express.Router()

leadRouter.use(bodyParser.json())

leadRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then((leaders) => {
                res.status = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .post(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.create(req.body)
            .then(leader => {
                console.log('Leader created ', leader)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not suported on leaders')
    })

    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, err => next(err))
            .catch(err => next(err))
    })

leadRouter.route('/:leadId')
    .get((req, res, next) => {
        Leaders.findById(req.params.leadId)
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(leader)
            }, err => next(err))
            .catch(err => next(err))
    })


    .post( authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not suported on /leaders/' + req.params.leadId)
    })

    .put(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leadId, { $set: req.body }, { new: true })
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                console.log('sth wrong??')
                res.json(leader)
            }, err => next(err))
            .catch(err => next(err))
    })

    .delete(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
        Leaders.findByIdAndDelete(req.params.leadId)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, err => next(err))
            .catch(err => next(err))
    })

module.exports = leadRouter