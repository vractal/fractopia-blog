/* eslint-disable no-console */
const fs = require('fs')
const cheerio = require('cheerio')
const sharp = require('sharp')

const generateThumbs = (source, destination) => {
  sharp(source, { failOnError: false })
    .resize({
      width: 1920,
      withoutEnlargement: true
    })
    .toFile(destination, (err) => {
      if (err) {
        console.log(err)
      } else {
        // eslint-disable-next-line no-console
        console.log('Average image generated: ' + destination)
      }
    })
}

module.exports = {
  downloadBase64: (content, fileName) => {
    if (content) {
      const $ = cheerio.load(content)
      $('img').each((i, img) => {
        const uniqueCode = new Date().getTime()
        const encodedBase64 = $(img).attr('src')
        if (encodedBase64.startsWith('data:')) {
          const buff = Buffer.from(encodedBase64.split(',')[1], 'base64')
          const fileUrl = 'api/uploads/images/' + fileName + '-' + uniqueCode + '.png'
          fs.writeFileSync(fileUrl, buff)
          const average = fileUrl.replace('images/', 'images/averages/')
          console.log('Base64 saved to image file: ', fileUrl)
          generateThumbs(fileUrl, average)
          content = content.replace(encodedBase64, '/' + average)
        }
      })
    }
    return content
  }
}
