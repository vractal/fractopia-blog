<template>
  <div class="vue-dynamic-layout">
    <dl-sections v-model="sections" />
    <dl-editor v-model="sections" :enabled="editMode" @save="save" @input="changed" />
  </div>
</template>
<script>
import DlSections from './Sections.vue'
import DlEditor from './editor/Editor.vue'
export default {
  name: 'DlLayout',
  components: {
    DlSections,
    DlEditor
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
    },
    defaultColors: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      sections: [],
      active: {
        section: null,
        column: null,
        component: null
      }
    }
  },
  watch: {
    value() {
      this.sections = [...this.value]
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.sections = this.value
    }
  },
  provide () {
    return {
      active: this.active,
      setActive: this.setActive,
      defaultColors: this.defaultColors
    }
  },
  methods: {
    setActive(active) {
      Object.keys(this.active).forEach(key => {
        if (active[key] !== undefined) {
          this.active[key] = active[key]
        } else {
          this.active[key] = null
        }
      })
    },
    changed() {
      this.$emit('input', this.sections)
    },
    save() {
      this.$emit('save', this.sections)
    }
  }
}
</script>
<style>
  .vue-dynamic-layout .vue-dynamic-editable {
    cursor: pointer;
  }

  .vue-dynamic-layout .vue-dynamic-editable:hover {
    outline: 1px dashed #b0b0b0;
  }

  .vue-dynamic-layout .vue-dynamic-editable[data-active="true"] {
    outline: 1px dashed #b0b0b0;
  }

  .vue-dynamic-layout .dl-form {
    background-color: #fff;
    border-radius: 10px;
  }
</style>
