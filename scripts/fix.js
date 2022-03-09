require('../api/database')
const mongoose = require('mongoose')
const Page = mongoose.model('Page')
const Product = mongoose.model('Product')
const Post = mongoose.model('Post')
const Event = mongoose.model('Event')

const fixPageContents = async () => {
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

const fixBase64Images = async () => {
  const pages = await Page.find()
  for (const page of pages) {
    await page.save()
  }
  const products = await Product.find()
  for (const product of products) {
    await product.save()
  }
  const posts = await Post.find()
  for (const post of posts) {
    await post.save()
  }
  const events = await Event.find()
  for (const event of events) {
    await event.save()
  }
}

const fix = async () => {
  await fixPageContents()
  await fixBase64Images()
  process.exit()
}

fix()
