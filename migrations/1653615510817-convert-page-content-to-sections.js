require('../api/database')
const mongoose = require('mongoose')
const Page = mongoose.model('Page')

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  const pages = await Page.find()
  for (const page of pages) {
    // eslint-disable-next-line no-console
    if (page.content && (!page.sections || page.sections.length === 0)) {
      page.sections.push({
        background: null,
        attrs: {
          fluid: false
        },
        columns: [
          {
            background: null,
            attrs: {
              lg: '12'
            },
            components: [
              {
                type: 'p',
                attrs: {
                  class: ''
                },
                content: page.content,
                category: 'paragraph'
              }
            ]
          }
        ]
      })
      page.content = null
      await page.save()
    }
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down }
