const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const MediaSchema = mongoose.Schema({

  type: String, // Tipo de documento
  title: { // Título
    type: String,
    required: true
  },
  category: String, // TODO criar rotina para transferir este valor para categories e excluir este campo
  categories: [String], // Categorias
  description: { // Descrição
    type: String
  },
  authors: [Object], // Autores
  publishing_date: Date, // Data de publicação
  publishing_date_format: { // Formato da data de publicação
    type: String,
    default: 'DD/MM/YYYY'
  },
  source: String, // Fonte
  volume: String, // Volume
  number: String, // Número da publicação
  pages: String, // Páginas
  organizers: [Object], // Organizadores
  city: String, // Cidade
  publishing_house: String, // Editora
  institution: String, // Instituição
  languages: [String], // Idiomas
  url: String, // Link do arquivo
  doi: String, // Identificador de Objeto Digital
  patent_legal_status: String, // Disponibilidade
  tags: [String], // Palavras-chave

  additional_infos: [Object], // Informações adicionais

  docs: [{ // Documentos em anexo
    type: ObjectId,
    ref: 'Attachment',
    autopopulate: true
  }],
  image: { // Foto de capa
    type: ObjectId,
    ref: 'Attachment',
    autopopulate: true
  },
  oembed: String, // Vídeo embedado
  oembed_thumb: String, // Capa do vídeo embedado

  notes: String // Anotações
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

MediaSchema.plugin(require('mongoose-autopopulate'))

const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema)
module.exports = Media
