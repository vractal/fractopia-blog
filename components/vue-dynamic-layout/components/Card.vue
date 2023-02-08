<template>
  <component :is="attrs.href && !isEditing ? 'a' : 'div'" :href="attrs.href" :target="attrs.href && attrs.href.startsWith('http') ? '_blank' : ''">
    <b-card v-if="attrs.orientation === 'vertical'" no-body :style="style" v-bind="{...attrs, header: null, footer: null}" :img-src="attrs['img-src'] ? attrs['img-src'].url : ''" :bg-variant="attrs['bg-variant'] || 'primary'" @click="$emit('click')">
      <b-card-header v-if="attrs.header" :style="headerStyle">
        {{ attrs.header }}
      </b-card-header>
      <b-card-body>
        <b-card-title v-if="attrs.title" :style="titleStyle">
          {{ attrs.title }}
        </b-card-title>
        <b-card-sub-title v-if="attrs['sub-title']" class="mb-1" :style="subTitleStyle">
          {{ attrs['sub-title'] }}
        </b-card-sub-title>
        <b-card-text v-if="attrs.text" :style="textStyle">
          {{ attrs.text }}
        </b-card-text>
        <b-link v-for="(link, index) in attrs.links" :key="'card-link-' + index" v-bind="link" class="card-link">{{ link.title }}</b-link>
      </b-card-body>
      <b-card-footer v-if="attrs.footer" :style="footerStyle">
        {{ attrs.footer }}
      </b-card-footer>
    </b-card>
    <b-card v-else :style="style" no-body class="overflow-hidden" v-bind="{...attrs, 'img-src': null, header: null, footer: null}" :bg-variant="attrs['bg-variant'] || 'primary'" @click="$emit('click')">
      <b-card-header v-if="attrs.header" :style="headerStyle">
        {{ attrs.header }}
      </b-card-header>
      <b-row no-gutters>
        <b-col v-if="attrs['img-src'] && (!attrs['img-align'] || attrs['img-align'] === 'left')" md="6" :style="'background-image: url('+attrs['img-src'].url+'); background-repeat: no-repeat; background-size: cover; background-position: center center;'" />
        <b-col md="6">
          <b-card-body>
            <b-card-title v-if="attrs.title" :style="titleStyle">
              {{ attrs.title }}
            </b-card-title>
            <b-card-sub-title v-if="attrs['sub-title']" class="mb-1" :style="subTitleStyle">
              {{ attrs['sub-title'] }}
            </b-card-sub-title>
            <b-card-text v-if="attrs.text" :style="textStyle">
              {{ attrs.text }}
            </b-card-text>
            <b-link v-for="(link, index) in attrs.links" :key="'card-link-' + index" v-bind="link" class="card-link">{{ link.title }}</b-link>
          </b-card-body>
        </b-col>
        <b-col v-if="attrs['img-src'] && attrs['img-align'] === 'right'" md="6">
          <b-card-img :src="attrs['img-src']" :alt="attrs.title" class="rounded-0" />
        </b-col>
      </b-row>
      <b-card-footer v-if="attrs.footer" :style="footerStyle">
        {{ attrs.footer }}
      </b-card-footer>
    </b-card>
  </component>
</template>

<script>
import componentMixins from './mixins'

export default {
  inject: ['isEditing'],
  name: 'DlCard',
  mixins: [componentMixins],
  computed: {
    attrs() {
      return this.data.attrs
    },
    style() {
      return this.attrs['background-color'] ? 'background-color: ' + this.attrs['background-color'] + ' !important' : ''
    },
    headerStyle() {
      return this.attrs['header-color'] ? 'color: ' + this.attrs['header-color'] + ' !important' : ''
    },
    titleStyle() {
      return this.attrs['title-color'] ? 'color: ' + this.attrs['title-color'] + ' !important' : ''
    },
    subTitleStyle() {
      return this.attrs['sub-title-color'] ? 'color: ' + this.attrs['sub-title-color'] + ' !important' : ''
    },
    textStyle() {
      return this.attrs['text-color'] ? 'color: ' + this.attrs['text-color'] + ' !important' : ''
    },
    footerStyle() {
      return this.attrs['footer-color'] ? 'color: ' + this.attrs['footer-color'] + ' !important' : ''
    }
  },
  watch: {
    isEditing(val) {
      console.log(val)
    }
  }
}
</script>
<style scoped>
.card .card-link {
  color: #007bff;
}
</style>
