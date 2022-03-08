<template>
  <div>
    <div class="mb-3">
      <b-btn variant="primary" size="sm" class="mr-2" @click="close">
        <b-icon-chevron-left />
      </b-btn>
      <strong>
        {{ title }}
      </strong>
    </div>
    <div v-if="form">
      <div class="px-3 py-3 dl-form">
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
              <b-form-group :label="'Texto do título'">
                <b-form-input v-model="form.content" @input="changed" />
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
                  <b-icon-grip-vertical /> Horizontal
                </b-btn>
                <b-btn size="sm" :variant="form.attrs.orientation === 'vertical' ? 'primary' : 'secondary'" @click="form.attrs.orientation = 'vertical'; changed()">
                  <b-icon-grip-horizontal /> Vertical
                </b-btn>
              </b-form-group>
              <b-form-group label="Imagem">
                <b-form-input v-model="form.attrs['img-src']" placeholder="URL da imagem" class="mb-1" @input="changed" />
                <div v-if="form.attrs.orientation !== 'vertical'">
                  <b-btn size="sm" :variant="(!form.attrs['img-align'] || form.attrs['img-align'] === 'left') ? 'primary' : 'secondary'" @click="form.attrs['img-align'] = 'left'; changed()">
                    <b-icon-text-left />
                  </b-btn>
                  <b-btn size="sm" :variant="form.attrs['img-align'] === 'right' ? 'primary' : 'secondary'" @click="form.attrs['img-align'] = 'right'; changed()">
                    <b-icon-text-right />
                  </b-btn>
                </div>
              </b-form-group>
              <b-form-group label="Cabeçalho">
                <b-form-input v-model="form.attrs.header" @input="changed" />
              </b-form-group>
              <b-form-group label="Título">
                <b-form-input v-model="form.attrs.title" @input="changed" />
              </b-form-group>
              <b-form-group label="Subtítulo">
                <b-form-input v-model="form.attrs['sub-title']" @input="changed" />
              </b-form-group>
              <b-form-group label="Texto">
                <b-form-textarea v-model="form.attrs.text" @input="changed" />
              </b-form-group>
              <b-form-group label="Rodapé">
                <b-form-input v-model="form.attrs.footer" @input="changed" />
              </b-form-group>
              <AddLink v-model="form.attrs.links" @input="changed" />
              <b-form-group label="Cor de fundo">
                <b-btn v-for="variant in variants" :key="variant" size="sm" :variant="variant" @click="form.attrs['bg-variant'] = variant; changed()">
                  <b-icon-check-circle v-if="form.attrs['bg-variant'] === variant" />
                  <b-icon-check v-else />
                </b-btn>
              </b-form-group>
              <b-form-group label="Alinhamento">
                <b-btn size="sm" :variant="form.attrs.align === 'left' ? 'primary' : 'secondary'" @click="form.attrs.align = 'left'; changed()">
                  <b-icon-text-left />
                </b-btn>
                <b-btn size="sm" :variant="form.attrs.align === 'center' ? 'primary' : 'secondary'" @click="form.attrs.align = 'center'; changed()">
                  <b-icon-text-center />
                </b-btn>
                <b-btn size="sm" :variant="form.attrs.align === 'right' ? 'primary' : 'secondary'" @click="form.attrs.align = 'right'; changed()">
                  <b-icon-text-right />
                </b-btn>
              </b-form-group>
            </div>
            <div v-if="form.category === 'banners'">
              <Upload v-model="form.attrs.items" label="Banners" type="images" multiple edit-title edit-description edit-link @input="changed" />
            </div>
            <div class="text-right">
              <b-btn
                variant="default"
                size="sm"
                class="mb-4"
                @click="advancedMode = !advancedMode"
              >
                Opções avançadas
                <b-icon-chevron-down v-if="advancedMode" />
                <b-icon-chevron-right v-else />
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
import componentCategories from './data/component-categories'
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
