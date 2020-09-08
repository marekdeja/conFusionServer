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
    .get(cors.cors, authenticate.verifyOrdinaryUser, (req, res, next) => {
        const reqUserId = req.user._id
        Favorites.find({user: reqUserId})
            .populate('dishes')
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
                        const newFavorites = req.body
                        for (let i = 0; i < newFavorites.length; i++) {
                            console.log(favorite[0].dishes)
                            //check if the dishes do not duplicate
                            if (favorite[0].dishes.indexOf(newFavorites[i]._id) == -1) {
                                favorite[0].dishes.push(newFavorites[i]._id)
                            }

                        }
                        favorite[0].save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err));
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
        .delete(cors.corsWithOptions,
            authenticate.verifyOrdinaryUser,
            (req, res, next) => {
                const reqUserId = req.user._id
                Favorites.find({user: reqUserId})
                .then((userFavorite) => {
                    console.log(userFavorite)
                    //userFavorite[]
                    if (userFavorite != null) {
                        for (var i = (userFavorite.dishes.length - 1); i >= 0; i--) {
                            userFavorite.dishes.id(userFavorite.dishes[i]._id).remove();
                        }
                        userFavorite.save()
                            .then((userFavorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(userFavorite);
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('Favorite list for  ' + reqUserId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));

            })

module.exports = favoriteRouter