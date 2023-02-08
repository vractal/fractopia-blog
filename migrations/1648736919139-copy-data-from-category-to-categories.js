require('../api/database')
const mongoose = require('mongoose')
const Media = mongoose.model('Media')

/**
 * Make any changes you need to make to the database here
 */
async function up () {
  const medias = await Media.find()
  for (const media of medias) {
    if (media.category) {
      media.categories = [media.category]
      await media.save()
    }
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  const medias = await Media.find()
  for (const media of medias) {
    if (media.categories && media.categories.length > 0) {
      media.category = media.categories[0]
      await media.save()
    }
  }
}

module.exports = { up, down }
