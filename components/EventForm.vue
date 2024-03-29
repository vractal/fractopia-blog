<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <b-row>
        <b-col md="12">
          <b-form-group label="Dê um nome para o evento *">
            <validation-provider v-slot="{ errors }" name="título" rules="required">
              <b-form-input v-model="form.title" name="title" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <validation-provider v-slot="{ errors }" name="começa em" rules="required">
            <date-time-form v-model="form.start_at" label="Começa em" />
            <span class="text-danger">{{ errors[0] }}</span>
          </validation-provider>
        </b-col>
        <b-col md="6">
          <date-time-form v-model="form.end_at" label="Termina em" />
        </b-col>
        <b-col md="12">
          <b-form-group label="Descrição curta" description="Escreva um texto curto resumindo o conteúdo com até 160 caractéres">
            <b-form-textarea v-model="form.description" name="description" />
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group label="Descrição completa">
            <quill-editor ref="quillEdit" v-model="form.content" />
            <input id="quillfile" type="file" hidden @change="quillUpload">
          </b-form-group>
        </b-col>
        <b-col md="12">
          <Upload v-model="form.image" type="images" label="Foto de capa" />
        </b-col>
        <b-col md="12">
          <Upload v-model="form.docs" label="Documentos" type="documents" multiple edit-title />
        </b-col>
        <b-col md="12">
          <tags-form v-model="form.tags" :items="currentTags" />
        </b-col>
      </b-row>
      <b-button class="mb-4 mt-4" type="submit" variant="success" block :disabled="invalid">
        Salvar
      </b-button>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

import mixinForm from '@/mixins/form'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  mixins: [mixinForm],
  props: {
    event: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      currentTags: [],
      form: {
        title: '',
        description: '',
        content: '',
        image: null,
        tags: [],
        docs: [],
        start_at: null,
        end_at: null
      }
    }
  },
  async created () {
    this.toForm(this.form, this.event)
    this.currentTags = await this.$axios.$get('/api/events/current_tags')
  },
  methods: {
    async save () {
      if (this.event) {
        const event = await this.$axios.$put('/api/events/' + this.event._id, this.form)
        if (event) {
          this.$toast.success('Evento atualizado com sucesso!')
          this.$router.push('/conta/events')
        }
      } else {
        const event = await this.$axios.$post('/api/events', this.form)
        if (event) {
          this.$toast.success('Evento cadastrado com sucesso!')
          this.$router.push('/conta/events')
        }
      }
    }
  }
}
</script>
