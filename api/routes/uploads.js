const fs = require('fs')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { PDFImage } = require('pdf-image')
const axios = require('axios')
const auth = require('../config/auth')
const Attachment = require('../models/Attachment')

const createPath = (path) => {
  !fs.existsSync(path) && fs.mkdirSync(path)
}

const UPLOAD_PATH = 'api/uploads/'
createPath(UPLOAD_PATH)

const imagesPath = () => {
  let path = UPLOAD_PATH
  path += 'images/'
  createPath(path)
  return path
}

const thumbsPath = () => {
  let path = imagesPath()
  path += 'thumbs/'
  createPath(path)
  return path
}

const averagesPath = () => {
  let path = imagesPath()
  path += 'averages/'
  createPath(path)
  return path
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath())
  },
  filename: (req, file, cb) => {
    let filename = file.originalname
    const path = imagesPath()
    if (fs.existsSync(path + filename)) {
      const nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  }
})
const imageUploader = multer({
  storage: imageStorage,
  limits: {
    fileSize: 32 * 1024 * 1024
  }
})

router.post('/images', [auth.authenticated, imageUploader.single('file')], (req, res) => {
  const filename = req.file.filename

  const original = imagesPath() + filename
  const thumb = thumbsPath() + filename
  const average = averagesPath() + filename

  sharp(original, { failOnError: false })
    .resize({
      width: 400,
      height: 400,
      withoutEnlargement: true,
      fit: sharp.fit.inside
    })
    .toFile(thumb, async (err) => {
      if (!err) {
        sharp(original, { failOnError: false })
          .resize({
            width: 1920,
            withoutEnlargement: true
          })
          .toFile(average, async (err) => {
            if (!err) {
              const attachment = new Attachment({
                url: '/' + original,
                thumb: '/' + thumb,
                average: '/' + average
              })
              await attachment.save()
              res.status(201).send(attachment)
            }
          })
      } else {
        const attachment = new Attachment({
          url: '/' + original
        })
        await attachment.save()
        res.status(201).send(attachment)
      }
    })
})

const documentsPath = () => {
  let path = UPLOAD_PATH
  path += 'documents/'
  createPath(path)
  return path
}

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsPath())
  },
  filename: (req, file, cb) => {
    let filename = file.originalname
    const path = documentsPath()
    if (fs.existsSync(path + filename)) {
      const nameArr = filename.split('.')
      nameArr[0] += '-' + Date.now()
      filename = nameArr.join('.')
    }
    cb(null, filename)
  }
})
const documentUploader = multer({
  storage: documentStorage,
  limits: {
    fileSize: 32 * 1024 * 1024
  }
})
router.post('/documents', [auth.authenticated, documentUploader.single('file')], async (req, res) => {
  const filename = req.file.filename
  const path = documentsPath()

  if (filename.endsWith('.pdf')) {
    const thumb = thumbsPath() + filename.replace('.pdf', '.png')
    const average = averagesPath() + filename.replace('.pdf', '.png')

    const pdfImage = new PDFImage(req.file.path)

    pdfImage.convertPage(0).then(function(original) {
      sharp(original, { failOnError: false })
        .resize({
          width: 400,
          height: 400,
          withoutEnlargement: true,
          fit: sharp.fit.cover
        })
        .toFile(thumb, (err) => {
          if (!err) {
            sharp(original, { failOnError: false })
              .resize(1920)
              .toFile(average, async (err) => {
                if (!err) {
                  const attachment = new Attachment({
                    title: filename,
                    url: '/' + req.file.path,
                    average: '/' + average,
                    thumb: '/' + thumb
                  })
                  await attachment.save()
                  res.status(201).send(attachment)
                }
              })
          }
        })
    }).catch(() => {})
  } else {
    const attachment = new Attachment({ title: filename, url: path + filename })
    await attachment.save()
    res.status(201).send(attachment)
  }
})

router.get('/oembed', async (req, res) => {
  const rawData = await axios.get('http://open.iframe.ly/api/oembed?url=' + req.query.url + '&origin=diegomr86').catch(() => {})
  if (rawData && rawData.data) {
    res.json(rawData.data)
  } else {
    res.status(404).send('Não foi possível carregar o conteúdo do link')
  }
})

module.exports = router
