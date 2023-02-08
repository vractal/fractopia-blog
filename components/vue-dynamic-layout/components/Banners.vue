<template>
  <div @click="$emit('click')">
    <div v-if="data.attrs.items && data.attrs.items.length" class="banners-component">
      <b-carousel v-model="slide" :interval="7000" :indicators="data.attrs.items.length > 1" class="banners">
        <template v-for="(item, index) in data.attrs.items">
          <b-carousel-slide v-if="item" :key="index" :img-src="item.url" :img-alt="item.title">
            <template v-if="item.link">
              <b-btn v-if="item.link.startsWith('http')" :href="item.link" target="_blank" variant="secondary" class="mt-md-4 btn-home">{{ item.link_title || 'Saiba mais' }}</b-btn>
              <b-btn v-else :to="item.link" variant="secondary" class="mt-md-4 btn-home">{{ item.link_title || 'Saiba mais' }}</b-btn>
            </template>
          </b-carousel-slide>
        </template>
      </b-carousel>

      <div v-if="data.attrs.items[slide].description || data.attrs.items[slide].title" class="banner-description">
        <div v-if="data.attrs.items[slide].title">
          <h4>{{ data.attrs.items[slide].title }}</h4>
        </div>
        <div v-if="data.attrs.items[slide].description">
          {{ data.attrs.items[slide].description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import componentMixins from './mixins'
export default {
  name: 'DlBanners',
  mixins: [componentMixins],
  data() {
    return {
      slide: 0,
      sliding: null
    }
  }
}
</script>
