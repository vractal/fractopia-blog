<template>
  <div class="vue-dynamic-layout-sections">
    <div v-for="(section, index) in sections" :key="'section-' + index" :style="style(section)">
      <b-container
        :id="'dl-section-' + index"
        v-bind="{...section.attrs}"
        class="vue-dynamic-editable dl-section"
        :data-active="active.section === index"

        @click.self="edit(index)"
      >
        <dl-columns v-model="section.columns" :edit-mode="editMode" :section="index" />
      </b-container>
    </div>
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
    style(section) {
      const attrs = section.attrs
      const styles = []
      if (attrs['background-color']) {
        styles.push('background-color: ' + attrs['background-color'] + ' !important')
      }
      return styles.join('; ')
    }

  }
}
</script>
