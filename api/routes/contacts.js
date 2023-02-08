const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const Contact = mongoose.model('Contact')

router.get('/', auth.admin, (req, res) => {
  const query = {}
  Contact.find(query).sort({ createdAt: -1 }).exec((err, contacts) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(contacts)
    }
  })
})

router.get('/unread', auth.admin, (req, res) => {
  const query = {
    read: { $ne: true }
  }
  Contact.count(query).exec((err, contactsQtd) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(contactsQtd)
    }
  })
})

router.get('/:id', auth.admin, async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact.read) {
    contact.read = true
    await contact.save()
  }
  res.json(contact)
})

router.post('/contact', (req, res) => {
  const contact = new Contact()

  contact.name = req.body.name
  contact.email = req.body.email
  contact.message = req.body.message

  contact.save().then(() => {
    res.json(contact)
  }).catch(err => {
    res.status(422).send(err.message)
  })
})

router.delete('/:id', auth.admin, (req, res) => {
  Contact.findOne({
    _id: req.params.id
  }).exec((err, contact) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      contact.remove()
      res.send(contact)
    }
  })
})

module.exports = router
