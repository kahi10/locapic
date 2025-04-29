var express = require('express');
var router = express.Router();
const Place = require('../models/places');
const { checkBody } = require('../modules/checkBody');


//Router chargé d'inscrire un marqueur
router.post('/', (req, res) => {
    if (!checkBody(req.body, ['nickname', 'name', 'latitude', 'longitude'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return
    }

    Place.findOne({ nickname: new RegExp(req.body.nickname, "i"), name: new RegExp(req.body.name, "i"), latitude: req.body.latitude, longitude: req.body.longitude }).then(data => {
        if (data) {
            res.json({ result: false, error: 'Place already exists' });
        } else {
            const newPlace = new Place({
                nickname: req.body.nickname,
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude,

            });
            newPlace.save().then(() => {
                Place.find().then(data => {
                    res.json({ result: true });
                });
            });
        }
    });
});

router.get('/:nickname', (req, res) => {
    if (!checkBody(req.params, ['nickname'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return
    }
    Place.find({ nickname: new RegExp(req.body.nickname, "i")})
    .then(data => {
        if (data.length) {
            res.json({ result: true, places: data });
        } else {
            res.json({ result: false, error: 'Not found' })
        }
    });
})

router.delete('/', (req, res) => {
    if (!checkBody(req.body, ['nickname', 'name'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return
    }
    Place.find({ nickname: new RegExp(req.body.nickname, "i"), name: new RegExp(req.body.name, "i")})
        .then(data => {
            // res.json({ result: data, request: req.body, error: 'Not found' })
            if (data.length) {
                Place.deleteOne({ nickname: new RegExp(req.body.nickname, "i"), name: new RegExp(req.body.name, "i")})
                .then(data => {
                    res.json({ result: true });
                });
            } else {
                res.json({ result: false, error: 'Not found' })
            }
        });
});



module.exports = router;