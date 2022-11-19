<template>
  <div class="vue-dynamic-layout-component-editor">
    <div v-if="form">
      <div class="px-2 py-2">
        <div>
          <div v-if="form.category">
            <div v-if="form.category === 'title'">
              <b-form-group :label="'Tamanho do título '">
                <b-btn-group>
                  <b-btn
                    size="sm"
                    :variant="form.type === 'h1' ? 'secondary' : 'primary'"
                    @click="setType('h1')"
                  >
                    H1
                  </b-btn>
                  <b-btn
                    size="sm"
                    :variant="form.type === 'h2' ? 'secondary' : 'primary'"
                    @click="setType('h2')"
                  >
                    H2
                  </b-btn>
                  <b-btn
                    size="sm"
                    :variant="form.type === 'h3' ? 'secondary' : 'primary'"
                    @click="setType('h3')"
                  >
                    H3
                  </b-btn>
                  <b-btn
                    size="sm"
                    :variant="form.type === 'h4' ? 'secondary' : 'primary'"
                    @click="setType('h4')"
                  >
                    H4
                  </b-btn>
                  <b-btn
                    size="sm"
                    :variant="form.type === 'h5' ? 'secondary' : 'primary'"
                    @click="setType('h5')"
                  >
                    H5
                  </b-btn>
                  <b-btn
                    size="sm"
                    :variant="form.type === 'h6' ? 'secondary' : 'primary'"
                    @click="setType('h6')"
                  >
                    H6
                  </b-btn>
                </b-btn-group>
              </b-form-group>
              <fieldset class="form-group">
                <legend>Texto do título</legend>
                <div class="d-flex align-items-center justify-content-between">
                  <b-form-input v-model="form.content" style="width: calc(100% - 28px);" @input="changed" />
                  <SelectColor v-model="form.attrs['color']" @input="changed" />
                </div>
              </fieldset>
              <b-form-group label="Alinhamento">
                <b-btn size="sm" :variant="!form.attrs.align || form.attrs.align === 'left' ? 'secondary' : 'primary'" @click="form.attrs.align = 'left'; changed()">
                  <b-icon-text-left />
                </b-btn>
                <b-btn size="sm" :variant="form.attrs.align === 'center' ? 'secondary' : 'primary'" @click="form.attrs.align = 'center'; changed()">
                  <b-icon-text-center />
                </b-btn>
                <b-btn size="sm" :variant="form.attrs.align === 'right' ? 'secondary' : 'primary'" @click="form.attrs.align = 'right'; changed()">
                  <b-icon-text-right />
                </b-btn>
              </b-form-group>
            </div>
            <div v-if="form.category === 'paragraph'">
              <b-form-group :label="'Texto do parágrafo'">
                <quill-editor
                  ref="quillEdit"
                  v-model="form.content"
                  style="background-color: #fff;"
                  @input="changed"
                />
              </b-form-group>
            </div>
            <div v-if="form.category === 'card'">
              <b-form-group label="Tipo de card">
                <b-btn size="sm" :variant="(!form.attrs.orientation || form.attrs.orientation === 'horizontal') ? 'primary' : 'secondary'" @click="form.attrs.orientation = 'horizontal'; changed()">
                  Horizontal
                </b-btn>
                <b-btn size="sm" :variant="form.attrs.orientation === 'vertical' ? 'primary' : 'secondary'" @click="form.attrs.orientation = 'vertical'; changed()">
                  Vertical
                </b-btn>
              </b-form-group>
              <div label="Imagem">
                <Upload v-model="form.attrs['img-src']" label="Imagem" type="images" @input="changed" />
                <div v-if="form.attrs.orientation !== 'vertical'" class="mb-4">
                  <b-btn size="sm" :variant="(!form.attrs['img-align'] || form.attrs['img-align'] === 'left') ? 'primary' : 'secondary'" @click="form.attrs['img-align'] = 'left'; changed()">
                    <b-icon-text-left />
                  </b-btn>
                  <b-btn size="sm" :variant="form.attrs['img-align'] === 'right' ? 'primary' : 'secondary'" @click="form.attrs['img-align'] = 'right'; changed()">
                    <b-icon-text-right />
                  </b-btn>
                </div>
              </div>
              <b-form-group label="Link principal">
                <b-form-input
                  v-model="form.attrs.href"
                  @input="changed"
                />
              </b-form-group>
              <fieldset class="form-group">
                <legend>Cabeçalho</legend>
                <div class="d-flex align-items-center justify-content-between">
                  <b-form-input v-model="form.attrs.header" style="width: calc(100% - 28px);" @input="changed" />
                  <SelectColor v-model="form.attrs['header-color']" @input="changed" />
                </div>
              </fieldset>
              <fieldset class="form-group">
                <legend>Título</legend>
                <div class="d-flex align-items-center justify-content-between">
                  <b-form-input v-model="form.attrs.title" style="width: calc(100% - 28px);" @input="changed" />
                  <SelectColor v-model="form.attrs['title-color']" @input="changed" />
                </div>
              </fieldset>
              <fieldset class="form-group">
                <legend>Subtítulo</legend>
                <div class="d-flex align-items-center justify-content-between">
                  <b-form-input v-model="form.attrs['sub-title']" style="width: calc(100% - 28px);" @input="changed" />
                  <SelectColor v-model="form.attrs['sub-title-color']" @input="changed" />
                </div>
              </fieldset>
              <fieldset class="form-group">
                <legend>Texto</legend>
                <div class="d-flex align-items-center justify-content-between">
                  <b-form-input v-model="form.attrs['text']" style="width: calc(100% - 28px);" @input="changed" />
                  <SelectColor v-model="form.attrs['text-color']" @input="changed" />
                </div>
              </fieldset>
              <fieldset class="form-group">
                <legend>Rodapé</legend>
                <div class="d-flex align-items-center justify-content-between">
                  <b-form-input v-model="form.attrs['footer']" style="width: calc(100% - 28px);" @input="changed" />
                  <SelectColor v-model="form.attrs['footer-color']" @input="changed" />
                </div>
              </fieldset>
              <AddLink v-model="form.attrs.links" label="Links adicionais" @input="changed" />
              <b-form-group label="Cor de fundo">
                <SelectColor v-model="form.attrs['background-color']" @input="changed" />
              </b-form-group>
              <b-form-group label="Alinhamento">
                <b-btn size="sm" :variant="!form.attrs.align || form.attrs.align === 'left' ? 'secondary' : 'primary'" @click="form.attrs.align = 'left'; changed()">
                  <b-icon-text-left />
                </b-btn>
                <b-btn size="sm" :variant="form.attrs.align === 'center' ? 'secondary' : 'primary'" @click="form.attrs.align = 'center'; changed()">
                  <b-icon-text-center />
                </b-btn>
                <b-btn size="sm" :variant="form.attrs.align === 'right' ? 'secondary' : 'primary'" @click="form.attrs.align = 'right'; changed()">
                  <b-icon-text-right />
                </b-btn>
              </b-form-group>
            </div>
            <div v-if="form.category === 'banners'">
              <Upload v-model="form.attrs.items" label="Banners" type="images" multiple edit-title edit-description edit-link @input="changed" />
            </div>
            <div v-if="form.category === 'button'">
              <b-form-group label="Texto do botão">
                <b-form-input
                  v-model="form.content"
                  @input="changed"
                />
              </b-form-group>
              <b-form-group label="Link">
                <b-form-input
                  v-model="form.attrs.href"
                  @input="changed"
                />
              </b-form-group>
              <b-form-group label="Tamanho">
                <b-form-select
                  v-model="form.attrs.size"
                  :options="sizes"
                  @input="changed"
                />
              </b-form-group>
              <b-form-group label="Tipo">
                <b-form-select
                  v-model="form.attrs.outlined"
                  :options="btnTypes"
                  @input="changed"
                />
              </b-form-group>
              <b-form-group label="Cor">
                <b-btn v-for="variant in variants" :key="variant" size="sm" :variant="variant" @click="form.attrs['variant'] = variant; changed()">
                  <b-icon-check-circle v-if="form.attrs['variant'] === variant" />
                  <b-icon-check v-else />
                </b-btn>
              </b-form-group>
            </div>
            <div>
              <b-btn
                variant="default"
                size="sm"
                class="mb-3"
                @click="advancedMode = !advancedMode"
              >
                Opções avançadas
              </b-btn>
            </div>
            <div v-if="advancedMode">
              <b-form-group label="Classes de estilo">
                <b-form-input v-model="form.attrs.class" @input="changed" />
              </b-form-group>
            </div>
            <div class="text-right">
              <b-btn variant="danger" size="sm" @click="$emit('remove')">
                <b-icon-trash />
              </b-btn>
            </div>
          </div>
          <div v-else>
            <b-btn
              v-for="key in Object.keys(componentCategories)"
              :key="key"
              block
              @click="setCategory(key)"
            >
              {{ componentCategories[key].title }}
            </b-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import colors from '../../../assets/css/colors.sass'
import componentCategories from './data/component-categories.json'
export default {
  name: 'DlComponentEditor',
  props: {
    value: {
      type: Object,
      default: () => null
    },
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      colors,
      componentCategories,
      form: {
        type: null,
        attrs: {
          class: ''
        },
        content: null,
        category: null
      },
      advancedMode: false,
      variants: [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'info',
        'light',
        'dark'
      ],
      sizes: [
        { value: 'sm', text: 'Pequeno' },
        { value: 'md', text: 'Médio' },
        { value: 'lg', text: 'Grande' }
      ],
      btnTypes: [
        { value: false, text: 'Sólido' },
        { value: true, text: 'Delineado' }
      ]
    }
  },
  watch: {
    value() {
      this.form = { ...this.value }
    }
  },
  created() {
    this.form = { ...this.value }
  },
  methods: {
    setType(type) {
      this.form.type = type
      this.changed()
    },
    setCategory(category) {
      this.form.category = category
      if (category) {
        if (category === 'button') {
          this.form.attrs.size = 'md'
          this.form.attrs.variant = 'primary'
          this.form.attrs.outlined = false
          this.form.content = 'Texto do botão'
        }
        this.setType(this.componentCategories[category].default)
      } else {
        this.setType(null)
      }
    },
    changed() {
      this.$emit('input', this.form)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
