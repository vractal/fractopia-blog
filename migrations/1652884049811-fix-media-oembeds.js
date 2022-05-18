require('../api/database')
const axios = require('axios')
const mongoose = require('mongoose')
const Media = mongoose.model('Media')
const Attachment = mongoose.model('Attachment')

async function up () {
  // Write migration here
  const medias = await Media.find()
  for (const media of medias) {
    if (['Áudio', 'Áudios', 'Vídeo', 'Vídeos'].includes(media.type) && !media.url && media.docs && media.docs.length > 0) {
      const docs = [...media.docs]
      for (const doc of docs) {
        if (doc.url) {
          media.url = doc.url
          const rawData = await axios.get('http://open.iframe.ly/api/oembed?url=' + encodeURI(media.url) + '&origin=diegomr86').catch(() => {})
          if (rawData && rawData.data) {
            const oembed = rawData.data

            if (oembed.thumbnail_url) {
              media.oembed_thumb = oembed.thumbnail_url
            }

            if (!oembed.html || oembed.html.includes('iframely-embed')) {
              media.oembed = null
            } else {
              media.oembed = oembed.html
            }
          }

          media.docs = media.docs.filter(d => d._id !== doc._id)
          await media.save()
          await Attachment.remove({ _id: doc._id })

          console.log('')
          console.log('!!!!!!!!! Generating oembed !!!!!!!!!')
          console.log(media.type)
          console.log(doc.url)
          console.log(media.oembed)
          console.log(media.url)
        }
      }
    }
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down }
