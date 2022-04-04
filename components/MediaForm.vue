<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form v-if="filters" @submit.prevent="validate().then(save)">
      <b-form-group label="Tipo de publicação *">
        <validation-provider v-slot="{ errors }" name="tipo" rules="required">
          <b-form-select v-model="form.type" :options="types">
            <template v-slot:first>
              <b-form-select-option value="" disabled>Selecione um tipo de publicação</b-form-select-option>
            </template>
          </b-form-select>
          <span class="text-danger">{{ errors[0] }}</span>
        </validation-provider>
      </b-form-group>
      <div v-if="form.type">
        <b-form-group v-if="form.type === 'Vídeo'" label="Link do vídeo">
          <b-form-input v-model="form.url" @input="loadUrl" />
          <b-spinner v-if="loadingUrl" small label="Carregando vídeo" />
          <div v-if="form.oembed && !loadingUrl" class="pt-3" v-html="form.oembed" />
        </b-form-group>

        <b-form-group label="Título *">
          <validation-provider v-slot="{ errors }" name="título" rules="required">
            <b-form-input v-model="form.title" name="title" />
            <span class="text-danger">{{ errors[0] }}</span>
          </validation-provider>
        </b-form-group>
        <b-form-group label="Categorias *">
          <validation-provider v-slot="{ errors }" name="categoria" rules="required">
            <b-form-checkbox-group v-model="form.categories" multiple :options="categories" />
            <span class="text-danger">{{ errors[0] }}</span>
          </validation-provider>
        </b-form-group>
        <b-form-group label="Descrição">
          <b-form-textarea v-model="form.description" name="description" rows="8" max-rows="20" />
        </b-form-group>
        <b-form-group label="Autores">
          <AuthorForm v-model="form.authors" />
        </b-form-group>
        <b-row>
          <b-col md="6">
            <b-form-group label="Data da publicação">
              <b-form-input
                id="publishing_date"
                v-model="form.publishing_date"
                type="date"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Formato da data">
              <b-form-select v-model="form.publishing_date_format" :options="dateFormatOptions" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Fonte">
          <b-form-input v-model="form.source" />
        </b-form-group>
        <b-form-group label="Volume">
          <b-form-input v-model="form.volume" />
        </b-form-group>
        <b-form-group label="Número da publicação">
          <b-form-input v-model="form.number" />
        </b-form-group>
        <b-form-group label="Páginas">
          <b-form-input v-model="form.pages" />
        </b-form-group>
        <b-form-group label="Organizadores">
          <OrganizerForm v-model="form.organizers" />
        </b-form-group>
        <b-form-group label="Cidade">
          <b-form-input v-model="form.city" />
        </b-form-group>
        <b-form-group label="Editora" description="Veículo de comunicação onde foi publicado">
          <b-form-input v-model="form.publishing_house" />
        </b-form-group>
        <b-form-group label="Instituição">
          <b-form-input v-model="form.institution" />
        </b-form-group>
        <tags-form v-model="form.languages" :items="filters.languages" label="Idiomas" />
        <div v-if="form.type !== 'Vídeo'">
          <b-form-group label="Link">
            <b-form-input v-model="form.url" />
          </b-form-group>
          <Upload v-model="form.docs" label="Adicionar arquivos" type="documents" multiple edit-title @uploaded="fileUploaded" />
        </div>
        <b-form-group label="DOI" description="Identificador de Objeto Digital">
          <b-form-input v-model="form.doi" />
        </b-form-group>
        <b-form-group label="Disponibilidade">
          <b-form-input v-model="form.patent_legal_status" />
        </b-form-group>
        <tags-form v-if="filters" v-model="form.tags" :items="filters.tags" />
        <b-form-group label="Informações adicionais">
          <additional-info-form v-model="form.additional_infos" />
        </b-form-group>
        <Upload v-model="form.image" type="images" :label="form.type === 'Fotografias' ? 'Enviar fotografia' : 'Foto de capa'" />
        <b-form-group label="Anotações" description="Este campo é reservado para anotações não aparece para os usuários">
          <b-form-textarea v-model="form.notes" />
        </b-form-group>
        <b-button class="mb-4 mt-4" type="submit" variant="success" block :disabled="invalid">
          Salvar
        </b-button>
      </div>
    </b-form>
  </ValidationObserver>
</template>

<script>
import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate'

import mixinForm from '@/mixins/form'
import categories from '@/data/categories.json'
import types from '@/data/media-types.json'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  mixins: [mixinForm],
  props: {
    media: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      categories,
      types,
      loadingUrl: false,
      filters: null,
      dateFormatOptions: {
        'DD/MM/YYYY': 'Dia/Mês/Ano',
        'MM/YYYY': 'Mês/Ano',
        YYYY: 'Ano'
      },
      form: {
        type: null, // Tipo de documento
        title: null, // Título
        categories: [], // Categorias
        description: null, // Descrição
        authors: [], // Autores
        publishing_date: null, // Data de publicação
        publishing_date_format: null, // Formato da data
        source: null, // Fonte
        volume: null, // Volume
        number: null, // Número da publicação
        pages: null, // Páginas
        organizers: [], // Organizadores
        city: null, // Cidade
        publishing_house: null, // Editora
        institution: null, // Instituição
        languages: [], // Idiomas
        url: null, // Link do aquivo
        doi: null, // Identificador de Objeto Digital
        patent_legal_status: null, // Disponibilidade
        tags: [], // Palavras chave
        additional_infos: [], // Informações adicionais
        docs: [], // Documentos em anexo
        image: null, // Foto de capa
        oembed: null, // Vídeo embedado
        oembed_thumb: null, // Capa do vídeo embedado
        notes: null // Anotações
      }
    }
  },
  async created() {
    this.toForm(this.form, this.media)
    this.filters = await this.$axios.$get('/api/medias/filters')
  },
  methods: {
    async save() {
      if (this.media) {
        const media = await this.$axios.$put('/api/medias/' + this.media._id, this.form)
        if (media) {
          this.$toast.success('Item atualizado com sucesso!')
          this.$router.push('/conta/medias')
        }
      } else {
        const media = await this.$axios.$post('/api/medias', this.form)
        if (media) {
          this.$toast.success('Item cadastrado com sucesso!')
          this.$router.push('/conta/medias')
        }
      }
    },
    fileUploaded(doc) {
      if (doc.average) {
        this.form.image = {
          url: doc.average,
          average: doc.average,
          thumb: doc.thumb
        }
      }
    },
    async loadUrl() {
      if (this.isValidUrl(this.form.url)) {
        this.loadingUrl = true
        const res = await this.$axios.$get('/api/uploads/oembed?url=' + encodeURI(this.form.url)).catch((e) => {
          this.loadingUrl = false
        })
        if (res) {
          this.form.title = res.title
          if (res.description) {
            this.form.description = res.description
            const tags = res.description.split(' ').filter(v => v.startsWith('#')).map(v => v.replace('#', ''))
            if (tags && tags.length) {
              this.form.tags = tags
            }
          } else {
            this.form.description = ''
          }

          if (res.thumbnail_url) {
            this.form.oembed_thumb = res.thumbnail_url
          }

          if (!res.html || res.html.includes('iframely-embed')) {
            this.form.oembed = undefined
          } else {
            this.form.oembed = res.html
          }
          this.form.publishing_house = res.provider_name
        }
        this.loadingUrl = false
      }
    },
    isValidUrl (string) {
      let url = false
      try {
        url = new URL(string)
      } catch (_) {
        return url
      }
      return url
    }
  }
}
</script>
