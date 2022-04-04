require('../api/database')
const mongoose = require('mongoose')
const Page = mongoose.model('Page')
const Product = mongoose.model('Product')
const Post = mongoose.model('Post')
const Event = mongoose.model('Event')

/**
 * Make any changes you need to make to the database here
 */
async function up () {
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

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down }
