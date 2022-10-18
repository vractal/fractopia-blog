const express = require('express')
const router = express.Router()
const Saved = require('../models/Saved')

router.get('/', (req, res) => {
  Saved.find().sort('timestamp').exec((err, saveds) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(saveds)
    }
  })
})

router.post('/', (req, res) => {
  const newSaved = new Saved(req.body)
  //   if (!newSaved.slug) {
  //     newSaved.slug = slugify(newSaved.title).toLowerCase()
  //   }
  newSaved.save((err, saved) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(saved)
    //   res.send(await Saved.findById(post._id))
    }
  })
})

router.delete('/', (req, res) => {
  const newSaved = new Saved(req.body)
  //   if (!newSaved.slug) {
  //     newSaved.slug = slugify(newSaved.title).toLowerCase()
  //   }
  newSaved.save((err, saved) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(saved)
      //   res.send(await Saved.findById(post._id))
    }
  })
})

router.delete('/:id', (req, res) => {
  Saved.findById(req.params.id).exec((err, saved) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      saved.remove()
      res.send(saved)
    }
  })
})
module.exports = router
