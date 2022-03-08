<template>
  <div class="vue-dynamic-layout" :class="{ editing: editMode }">
    <dl-sections v-model="sections" :edit-mode="editMode" />
    <dl-editor
      v-model="sections"
      :show="editMode"
      @save="save"
      @input="changed"
      @close="showEditor = false"
    />
    <b-btn
      v-if="canEdit && !showEditor"
      class="dl-editor-btn px-3"
      variant="primary"
      @click="showEditor = true"
    >
      <b-icon-pencil-square class="mr-2" /> Editar página
    </b-btn>
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
    canEdit: {
      type: Boolean,
      default: false
    },
    startEditing: {
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
      },
      showEditor: this.startEditing
    }
  },
  computed: {
    editMode() {
      return this.canEdit && this.showEditor
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
  provide() {
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
.vue-dynamic-layout.editing .vue-dynamic-editable {
  cursor: pointer;
}

.vue-dynamic-layout.editing .vue-dynamic-editable:hover {
  outline: 1px dashed #b0b0b0;
}

.vue-dynamic-layout.editing .vue-dynamic-editable[data-active="true"] {
  outline: 1px dashed #b0b0b0;
}

.vue-dynamic-layout .dl-form {
  background-color: #fff;
  border-radius: 10px;
}

.vue-dynamic-layout .dl-editor-btn {
  position: fixed;
  right: 0;
  top: 20%;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
