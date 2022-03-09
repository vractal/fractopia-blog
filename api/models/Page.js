const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const ObjectId = mongoose.Schema.Types.ObjectId
const { downloadBase64 } = require('./utils')

const PageSchema = mongoose.Schema({
  slug: {
    type: String,
    required: true,
    index: true,
    unique: true,
    min: 1
  },
  tags: [String],
  docs: [{
    type: ObjectId,
    ref: 'Attachment',
    autopopulate: true
  }],
  title: String,
  description: String,
  content: String,
  images: [{
    type: ObjectId,
    ref: 'Attachment',
    autopopulate: true
  }],
  sections: [Object]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

PageSchema.plugin(require('mongoose-autopopulate'))

PageSchema.plugin(uniqueValidator, {
  message: 'Esta URL já está sendo usada'
})

PageSchema.pre('save', function() {
  if (this.sections && this.sections.length) {
    this.sections.forEach((section, sectionIndex) => {
      if (section.columns && section.columns.length) {
        section.columns.forEach((column, columnIndex) => {
          if (column.components && column.components.length) {
            column.components.forEach((component, componentIndex) => {
              component.content = downloadBase64(component.content, this.slug)
            })
          }
        })
      }
    })
  }
})

const Page = mongoose.models.Page || mongoose.model('Page', PageSchema)
module.exports = Page
