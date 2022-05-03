require('../api/database')
const mongoose = require('mongoose')
const Media = mongoose.model('Media')
const Attachment = mongoose.model('Attachment')

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  const medias = await Media.find()
  for (const media of medias) {
    if (media.url) {
      if (
        media.type !== 'Áudio' &&
        media.type !== 'Vídeo' &&
        media.type !== 'Vídeos'
      ) {
        const attachment = new Attachment({
          type: 'documents',
          url: media.url
        })
        await attachment.save()
        media.docs.push(attachment._id)
        media.url = null
        await media.save()
      }
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
