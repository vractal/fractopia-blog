require('../api/database')
const mongoose = require('mongoose')
const Page = mongoose.model('Page')
const colors = {
  primary: '#523D38',
  secondary: '#E1846D',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  light: '#e2e2e2',
  dark: '#212529',
  white: '#ffffff'
}

const fixPageContents = async () => {
  const pages = await Page.find()
  for (const page of pages) {
    // eslint-disable-next-line no-console
    if (page.sections && page.sections.length > 0) {
      page.sections.forEach(section => {
        if (section.background) {
          section.attrs['background-color'] = colors[section.background]
          section.background = undefined
        }
        if (section.background_fluid) {
          section.attrs['background-fluid'] = true
          section.background_fluid = undefined
        }
        section.columns.forEach(column => {
          if (column.background) {
            column.attrs['background-color'] = colors[column.background]
            column.background = undefined
          }
          column.components.forEach(component => {
            if (component.type === 'p') {
              component.type = 'div'
            }
            if (component.background) {
              component.attrs['background-color'] = colors[component.background]
              component.background = undefined
            }
          })
        })
      })

      if (page.images && page.images.length > 0) {
        page.sections = [
          {
            background: null,
            background_fluid: null,
            attrs: {
              fluid: true,
              class: 'no-gutters py-0'
            },
            columns: [
              {
                background: null,
                attrs: {
                  lg: '12',
                  class: 'p-0'
                },
                components: [
                  {
                    type: 'banners',
                    attrs: {
                      class: '',
                      items: page.images
                    },
                    content: null,
                    category: 'banners'
                  }
                ]
              }
            ]
          }
        ].concat(page.sections)
      }

      if (page.title) {
        page.sections = [
          {
            attrs: {
              fluid: false,
              'background-color': null,
              'background-fluid': false,
              class: ''
            },
            columns: [
              {
                attrs: {
                  lg: 12,
                  'background-color': null,
                  class: ''
                },
                components: [
                  {
                    type: 'h1',
                    attrs: {
                      class: '',
                      color: colors.primary,
                      align: 'center'
                    },
                    content: page.title,
                    category: 'title'
                  }
                ]
              }
            ]
          }
        ].concat(page.sections)
      }
      console.log(page.sections)
      await page.save()
    }
  }
}

const fix = async () => {
  await fixPageContents()
  process.exit()
}

fix()
