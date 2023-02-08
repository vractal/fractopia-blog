require('../api/database')
const mongoose = require('mongoose')
const Media = mongoose.model('Media')
/**
 * Make any changes you need to make to the database here
 */
async function up() {
  const medias = await Media.find({ type: 'Áudio/Podcast' })
  for (const media of medias) {
    media.type = 'Áudio'
    await media.save()
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  const medias = await Media.find({ type: 'Áudio' })
  for (const media of medias) {
    media.type = 'Áudio/Podcast'
    await media.save()
  }
}

module.exports = { up, down }
