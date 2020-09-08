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
        Favorites.find({ user: reqUserId })
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
            Favorites.find({ user: reqUserId })
                .then(favorite => {
                    if (favorite.length > 0) {
                        const newFavorites = req.body
                        for (let i = 0; i < newFavorites.length; i++) {
                            //check if the dishes do not duplicate
                            //TODO: it may be checked if dish exists in dishes generally
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
        })
    .delete(cors.corsWithOptions,
        authenticate.verifyOrdinaryUser,
        (req, res, next) => {
            const reqUserId = req.user._id
            Favorites.find({ user: reqUserId })
                .then((userFavorite) => {
                    //userFavorite is an array
                    if (userFavorite.length > 0) {
                        userFavorite[0].remove()
                        res.statusCode = 200;
                        res.end('Removed favorite list for:' + req.user.username + '!');
                    }
                    else {
                        err = new Error('Favorite list for username: ' + req.user.username + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));

        })

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .post(cors.corsWithOptions,
        authenticate.verifyOrdinaryUser,
        (req, res, next) => {
            const dishId = req.params.dishId
            const reqUserId = req.user._id
            Favorites.find({ user: reqUserId })
                .then(favorite => {
                    if (favorite.length > 0) {
                        if (favorite[0].dishes.indexOf(dishId) == -1) {
                            favorite[0].dishes.push(dishId)
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
                            "dishes": dishId
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
        }
    )

    .delete(cors.corsWithOptions,
        authenticate.verifyOrdinaryUser,
        (req, res, next) => {
            const dishId = req.params.dishId
            const reqUserId = req.user._id
            Favorites.find({ user: reqUserId })
                .then((userFavorite) => {
                    //userFavorite is an array
                    if (userFavorite.length > 0) {
                        //TODO: check if the dish exist in the array 
                        console.log(userFavorite[0].dishes.indexOf({ _id: dishId }))
                        if (userFavorite[0].dishes.indexOf(dishId) != -1) {
                            userFavorite[0].dishes.remove({ _id: dishId })
                            if (userFavorite[0].dishes == 0) {
                                userFavorite[0].remove()
                                res.statusCode = 200;
                                res.end('Removed favorite list for:' + req.user.username + '!');
                            }
                            else {
                                userFavorite[0].save()
                                    .then((userFavorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(userFavorite);
                                    }, (err) => next(err));
                            }
                        }
                        else {
                            err = new Error('Dishes for the user: ' + req.user.username + ' do not contain dish with id: ' + dishId);
                            err.status = 404;
                            return next(err);
                        }
                    }
                    else {
                        err = new Error('Favorite list for username: ' + req.user.username + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));

        })

module.exports = favoriteRouter