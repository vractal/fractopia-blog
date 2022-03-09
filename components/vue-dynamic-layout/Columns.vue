<template>
  <div>
    <b-row>
      <b-col
        v-for="(column, index) in columns"
        :id="'dl-column-' + index"
        :key="'column-' + index"
        v-bind="{...column.attrs, ...backgroundAttrs(column.background)}"
        class="vue-dynamic-editable dl-column py-3"
        :data-active="active.column === index"
        @click.self="edit(index)"
      >
        <dl-components v-model="column.components" :edit-mode="editMode" :column="index" :section="section" />
        <!-- <b-tooltip
          v-if="editMode"
          :key="'dl-column-tooltip-' + index"
          :target="'dl-column-' + index"
          triggers="hover"
          variant="primary"
        >
          <b-btn variant="primary" @click="editColumn = index">
            Editar esta coluna
          </b-btn>
        </b-tooltip> -->
      </b-col>
    </b-row>
  </div>
</template>
<script>
import DlComponents from './Components.vue'

export default {
  inject: ['active', 'setActive'],
  name: 'DlColumns',
  components: {
    DlComponents
  },
  props: {
    value: {
      type: Array,
      default: () => []
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
  data() {
    return {
      columns: []
    }
  },
  watch: {
    value() {
      this.columns = this.value
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.columns = this.value
    }
  },
  methods: {
    edit(index) {
      this.setActive({
        section: this.section,
        column: index
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
