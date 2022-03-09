<template>
  <div>
    <template v-for="(component, index) in components">
      <template v-if="component.type">
        <component :is="'dl-' + component.category" :id="'dl-component-' + index" :key="'dl-component-' + index" :data="component" :data-active="active.component === index" class="vue-dynamic-editable dl-component" @click="edit(index)" />
        <!-- <dl-component-renderer :id="'dl-component-' + index" :key="'dl-component-' + index" class="dl-component" :class="{'active-component': editComponent === index}" :category="component.category" :attrs="component.attrs" @click="editComponent = index" @click.self="edit(index)" v-html="component.content" /> -->
      </template>
    </template>
  </div>
</template>
<script>
import DlTitle from './components/Title.vue'
import DlParagraph from './components/Paragraph.vue'
import DlCard from './components/Card.vue'
import DlBanners from './components/Banners.vue'

export default {
  inject: ['active', 'setActive'],
  name: 'DlComponents',
  components: {
    DlTitle,
    DlParagraph,
    DlCard,
    DlBanners
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    column: {
      type: Number,
      default: null
    },
    section: {
      type: Number,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      components: []
    }
  },
  watch: {
    value() {
      this.components = this.value
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.components = this.value
    }
  },
  methods: {
    edit(index) {
      this.setActive({
        section: this.section,
        column: this.column,
        component: index
      })
    }
  }
}
</script>
