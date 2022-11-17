<template>
  <div class="vue-dynamic-layout-sections">
    <template v-for="(section, index) in sections">
      <div :key="'section-' + index" v-bind="section.background_fluid ? backgroundAttrs(section.background) : {}">
        <b-container
          :id="'dl-section-' + index"
          v-bind="{...section.attrs, ...backgroundAttrs(section.background)}"
          class="vue-dynamic-editable dl-section"
          :data-active="active.section === index"

          @click.self="edit(index)"
        >
          <dl-columns v-model="section.columns" :edit-mode="editMode" :section="index" />
        </b-container>
      </div>
    </template>
  </div>
</template>
<script>
import DlColumns from './Columns.vue'
export default {
  inject: ['active', 'setActive'],
  name: 'DlSections',
  components: {
    DlColumns
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sections: []
    }
  },
  watch: {
    value() {
      this.sections = this.value
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.sections = this.value
    }
  },
  methods: {
    edit(index) {
      this.setActive({
        section: index
      })
    },

    backgroundAttrs(background) {
      const attrs = {}
      if (background) {
        if (background.startsWith('#')) {
          attrs.style = {}
          attrs.style['background-color'] = background
        } else {
          attrs.class = {}
          attrs.class['bg-' + background] = true
        }
      }
      return attrs
    }
  }
}
</script>
