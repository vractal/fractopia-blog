<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <b-row>
        <b-col md="12">
          <b-form-group label="Nome do produto *">
            <validation-provider v-slot="{ errors }" name="produto" rules="required">
              <b-form-input v-model="form.name" name="name" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group label="Resumo do produto *" description="Escreva um texto curto resumindo o produto com até 160 caractéres.">
            <validation-provider v-slot="{ errors }" name="resumo do produto" rules="required">
              <b-form-textarea v-model="form.description" name="description" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group label="Descrição completa">
            <quill-editor ref="quillEdit" v-model="form.content" />
            <input id="quillfile" type="file" hidden @change="quillUpload">
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Preço de venda *">
            <validation-provider v-slot="{ errors }" name="preço de venda" rules="required">
              <money v-model="form.price" class="form-control" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Quantidade disponível para venda *">
            <validation-provider v-slot="{ errors }" name="estoque" rules="required">
              <b-form-input v-model="form.qtd" type="number" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <Upload v-model="form.images" type="images" label="Fotos do produto" multiple />
        </b-col>
        <b-col md="12">
          <Upload v-model="form.docs" label="Documentos" type="documents" multiple edit-title />
        </b-col>
        <b-col md="12">
          <tags-form v-model="form.tags" :items="currentTags" />
        </b-col>
      </b-row>
      <h4 class="mt-4">Dados de envio <small class="font-weight-light">(incluindo a embalagem)</small></h4>
      <hr class="mt-0">
      <b-form-group label="Tipos de envio possíveis *">
        <validation-provider v-slot="{ errors }" name="tipos de envio" rules="required">
          <b-form-checkbox-group v-model="form.shipping_services" :options="servicos" />
          <span class="text-danger">{{ errors[0] }}</span>
        </validation-provider>
      </b-form-group>
      <b-row>
        <b-col md="4">
          <b-form-group label="Formato da embalagem *">
            <validation-provider v-slot="{ errors }" name="formato" rules="required">
              <v-select v-model="form.format" :options="formatos" :reduce="item => item.value" label="text" @input="formatChanged" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Peso *">
            <validation-provider v-slot="{ errors }" name="peso" :rules="weightValidation">
              <b-input-group append="kg">
                <money v-model="form.weight" class="form-control" v-bind="{ precision: 3, prefix: '' }" />
              </b-input-group>
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-form-group label="Comprimento *">
            <validation-provider v-slot="{ errors }" name="comprimento" :rules="lengthValidation">
              <b-input-group append="cm">
                <money v-model="form.length" class="form-control" v-bind="{ precision: 0, prefix: '' }" />
              </b-input-group>
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col v-if="form.format !== 2" md="4">
          <b-form-group label="Largura *">
            <validation-provider v-slot="{ errors }" name="largura" :rules="widthValidation">
              <b-input-group append="cm">
                <money v-model="form.width" class="form-control" v-bind="{ precision: 0, prefix: '' }" />
              </b-input-group>
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col v-if="form.format === 1" md="4">
          <b-form-group label="Altura *">
            <validation-provider v-slot="{ errors }" name="altura" rules="required|min_value:1|max_value:100">
              <b-input-group append="cm">
                <money v-model="form.height" class="form-control" v-bind="{ precision: 0, prefix: '' }" />
              </b-input-group>
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col v-if="form.format === 2" md="4">
          <b-form-group label="Diametro *">
            <validation-provider v-slot="{ errors }" name="diametro" rules="required|min_value:5|max_value:91">
              <b-input-group append="cm">
                <money v-model="form.diameter" class="form-control" v-bind="{ precision: 0, prefix: '' }" />
              </b-input-group>
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-checkbox v-model="form.published" switch class="mt-3">
        Este produto está publicado para venda? <b>{{ form.published ? 'Sim' : 'Não' }}</b>
      </b-form-checkbox>
      <b-button class="mb-4 mt-4" type="submit" variant="success" block :disabled="invalid">
        Salvar
      </b-button>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

import mixinForm from '@/mixins/form'
import formatos from '@/data/formatos-correios'
import servicos from '@/data/servicos-correios'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  mixins: [mixinForm],
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      formatos,
      servicos,
      currentTags: [],
      form: {
        name: '',
        description: '',
        content: '',
        price: 0,
        qtd: 0,
        docs: [],
        images: [],
        tags: [],
        weight: 0,
        format: 1,
        length: 0,
        height: 0,
        width: 0,
        diameter: 0,
        shipping_services: [],
        published: true
      }
    }
  },
  computed: {
    weightValidation() {
      if (this.form.format === 3) {
        return 'required|max_value:1|min_value:0.001'
      } else {
        return 'required|min_value:0.001'
      }
    },
    lengthValidation() {
      if (this.form.format === 1) {
        return 'required|min_value:15|max_value:100'
      } else if (this.form.format === 2) {
        return 'required|min_value:18|max_value:100'
      } else {
        return 'required|min_value:16|max_value:60'
      }
    },
    widthValidation() {
      if (this.form.format === 1) {
        return 'required|min_value:10|max_value:100'
      } else {
        return 'required|min_value:11|max_value:60'
      }
    }
  },
  async created () {
    this.toForm(this.form, this.product)
    this.currentTags = await this.$axios.$get('/api/products/current_tags')
  },
  methods: {
    async save () {
      if (this.product) {
        const product = await this.$axios.$put('/api/products/' + this.product._id, this.form)
        if (product) {
          this.$toast.success('Produto atualizado com sucesso!')
          this.$router.push('/conta/produtos')
        }
      } else {
        const product = await this.$axios.$post('/api/products', this.form)
        if (product) {
          this.$toast.success('Produto cadastrado com sucesso!')
          this.$router.push('/conta/produtos')
        }
      }
    },
    formatChanged () {
      if (this.form.format === 2) {
        this.form.width = 0
        this.form.height = 0
      } else if (this.form.format === 2) {
        this.form.diameter = 0
      } else if (this.form.format === 3) {
        this.form.height = 0
        this.form.diameter = 0
      }
    }
  }
}
</script>
