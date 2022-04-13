const excel = require('node-excel-export')
const moment = require('moment')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const auth = require('../config/auth')
const mediaTypes = require('../../data/media-types.json')
const Media = mongoose.model('Media')

const mountQuery = req => {
  const query = {}

  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { tags: { $regex: req.query.search, $options: 'i' } },
      { source: { $regex: req.query.search, $options: 'i' } },
      { 'authors.first_name': { $regex: req.query.search, $options: 'i' } },
      { 'authors.last_name': { $regex: req.query.search, $options: 'i' } }
    ]
  }
  if (req.query.type) {
    query.type = req.query.type
  }
  if (req.query.category) {
    query.categories = req.query.category
  }
  if (req.query.tag) {
    query.tags = req.query.tag
  }
  if (req.query.language) {
    query.languages = req.query.language
  }
  return query
}

const formatURL = url => {
  if (url) {
    if (url.startsWith('http')) {
      return url
    } else {
      return (process.env.BASE_URL || 'http://localhost:3000') + '/' + url
    }
  }
}

router.get('/export', (req, res) => {
  const query = mountQuery(req)
  Media.find(query)
    .sort({ createdAt: -1 })
    .exec((err, medias) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        const dataset = medias
        const specification = {
          type: {
            displayName: 'Tipo',
            width: 220,
            headerStyle: {}
          },
          title: {
            displayName: 'Título',
            width: 120,
            headerStyle: {}
          },
          categories: {
            displayName: 'Categorias',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return value.join(', ')
            }
          },
          description: {
            displayName: 'Descrição',
            width: '10',
            headerStyle: {}
          },
          authors: {
            displayName: 'Autores',
            width: 220,
            headerStyle: {},
            cellFormat(value, row) {
              return value
                .map(authors =>
                  [authors.first_name, authors.last_name]
                    .filter(name => name)
                    .join(' ')
                )
                .join(', ')
            }
          },
          publishing_date: {
            displayName: 'Data de publicação',
            width: 220,
            headerStyle: {},
            cellFormat(value, row) {
              return moment(value).format(row.publishing_date_format)
            }
          },
          source: {
            displayName: 'Fonte',
            width: 220,
            headerStyle: {}
          },
          volume: {
            displayName: 'Volume',
            width: 220,
            headerStyle: {}
          },
          number: {
            displayName: 'Número da publicação',
            width: 220,
            headerStyle: {}
          },
          pages: {
            displayName: 'Páginas',
            width: 220,
            headerStyle: {}
          },
          organizers: {
            displayName: 'Organizadores',
            width: 220,
            headerStyle: {},
            cellFormat(value, row) {
              return value
                .map(organizer =>
                  [organizer.first_name, organizer.last_name]
                    .filter(name => name)
                    .join(' ')
                )
                .join(', ')
            }
          },
          city: {
            displayName: 'Cidade',
            width: 220,
            headerStyle: {}
          },
          publishing_house: {
            displayName: 'Editora',
            width: 220,
            headerStyle: {}
          },
          institution: {
            displayName: 'Instituição',
            width: 220,
            headerStyle: {}
          },
          languages: {
            displayName: 'Idiomas',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return value.join(', ')
            }
          },
          doi: {
            displayName: 'DOI',
            width: 220,
            headerStyle: {}
          },
          patent_legal_status: {
            displayName: 'Disponibilidade',
            width: 220,
            headerStyle: {}
          },
          tags: {
            displayName: 'Palavras-chave',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return value.join(', ')
            }
          },
          additional_infos: {
            displayName: 'Informações adicionais',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return value
                .filter(info => info.label && info.value)
                .map(info => [info.label, info.value].join(': '))
                .join(', ')
            }
          },
          url: {
            displayName: 'URL',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return formatURL(value)
            }
          },
          docs: {
            displayName: 'Documentos em anexo',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return value
                .filter(document => document.url)
                .map(document => formatURL(document.url))
                .join(', ')
            }
          },
          image: {
            displayName: 'Foto de capa',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return value ? formatURL(value.url) : undefined
            }
          },
          createdAt: {
            displayName: 'Data de criação',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return moment(value).format('DD/MM/YYYY')
            }
          },
          updatedAt: {
            displayName: 'Data de atualização',
            width: 220,
            headerStyle: {},
            cellFormat(value) {
              return moment(value).format('DD/MM/YYYY')
            }
          },
          _id: {
            displayName: 'ID',
            width: 220,
            headerStyle: {}
          },
          notes: {
            displayName: 'Anotações',
            width: 220,
            headerStyle: {}
          }
        }
        const report = excel.buildExport([
          {
            specification,
            name: 'Biblioteca',
            data: dataset
          }
        ])

        // You can then return this straight
        res.attachment(`biblioteca-${moment().format('DD-MM-YYYY')}.xlsx`) // This is sails.js specific (in general you need to set headers)
        return res.send(report)
      }
    })
})

router.get('/', async (req, res) => {
  const query = mountQuery(req)
  console.log(query)
  const pagination = {
    total: await Media.count(query),
    per_page: req.query.per_page || 30,
    page: req.query.page || 1
  }

  const response = { pagination, data: null }
  Media.find(query)
    .populate(req.query.populate)
    .skip((pagination.page - 1) * pagination.per_page)
    .limit(parseInt(pagination.per_page))
    .sort({ createdAt: -1 })
    .exec((err, medias) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        response.data = medias
        res.json(response)
      }
    })
})

router.get('/filters', (req, res) => {
  const query = {}
  Media.find(query, 'tags categories languages').exec((err, medias) => {
    if (err) {
      res.status(422).send(err)
    } else {
      const tags = {}
      const categories = {}
      const languages = {}
      medias.forEach(media => {
        if (media && media.tags) {
          media.tags.forEach(tag => {
            tags[tag] = true
          })
        }
        if (media && media.categories) {
          media.categories.forEach(category => {
            categories[category] = true
          })
        }
        if (media && media.languages) {
          media.languages.forEach(language => {
            languages[language] = true
          })
        }
      })

      res.json({
        tags: Object.keys(tags).sort((a, b) => {
          return a.localeCompare(b)
        }),
        categories: Object.keys(categories).sort((a, b) => {
          return a.localeCompare(b)
        }),
        languages: Object.keys(languages).sort((a, b) => {
          return a.localeCompare(b)
        }),
        types: mediaTypes
      })
    }
  })
})

router.get('/:id', (req, res) => {
  Media.findOne({
    _id: req.params.id
  }).exec((err, media) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.json(media)
    }
  })
})

router.post('/', auth.admin, (req, res) => {
  const newMedia = new Media(req.body)
  if (!newMedia.publishing_date) {
    newMedia.publishing_date = new Date()
  }
  newMedia.save((err, media) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      res.send(media)
    }
  })
})

router.put('/:id', auth.admin, (req, res) => {
  const params = req.body
  Media.findOneAndUpdate(
    {
      _id: req.params.id
    },
    {
      $set: params
    },
    {
      upsert: true
    },
    (err, media) => {
      if (err) {
        res.status(422).send(err.message)
      } else {
        res.send(media)
      }
    }
  )
})

router.delete('/:id', auth.admin, (req, res) => {
  Media.findOne({
    _id: req.params.id
  }).exec((err, media) => {
    if (err) {
      res.status(422).send(err.message)
    } else {
      media.remove()
      res.send(media)
    }
  })
})

module.exports = router
