const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Favorites = require('../models/favorite')

const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, (req, res, next) => {
        console.log('HEJKA')
        Favorites.find({})
            //     .populate('comments.author')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(favorites)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions,
        authenticate.verifyOrdinaryUser,
        (req, res, next) => {
            const reqUserId = req.user._id
            console.log(reqUserId)
            console.log(req.body)
            Favorites.find({ user: reqUserId })
                .then(favorite => {
                    if (favorite.length > 0) {
                        console.log(favorite)
                        console.log('exist')
                        const newFavorites = req.body
                        console.log('newFavorites', newFavorites)
                        for (let i=0; i<newFavorites; i++){
                            favorite.dishes.push(newFavorites[i])
                        }                       
                    } else {
                        Favorites.create({
                            "user": reqUserId,
                            "dishes": req.body
                        })
                            .then(favorite => {
                                console.log('Favorite list created ', favorite)
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json')
                                res.json(favorite)
                            }, (err) => next(err))
                            .catch((err) => next(err))
                    }

                }, err => next(err))
                .catch((err) => next(err))
            // czy user sie zgadza
            // czy istnieje dany dish
            // 

            //     .then(dish => {
            //         console.log('Dish Created ', dish)
            //         res.statusCode = 200;
            //         res.setHeader('Content-Type', 'application/json')
            //         res.json(dish)
            //     }, (err) => next(err))
            //     .catch((err) => next(err))
        })

module.exports = favoriteRouter