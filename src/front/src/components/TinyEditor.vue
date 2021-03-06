<template>
  <editor
    :init="config"
    :disabled="readOnly"
    v-model="content"
    v-on:onInit="loaded"
    v-on:onChange="$emit('onChange', content)"
    model-events="change"
  />
</template>
<script>

import tinyConfig from '@/config/tinyMce'

export default {
  name: 'TinyEditor',
  props: [ 'value', 'readOnly', 'focused'],
  components: {
    editor: () => import(/* webpackChunkName: "tinymce" */ "@tinymce/tinymce-vue"),
  },
  computed: {
  },
  data: function () {
    return {
      content: this.value,
      editor: false
    }
  },

  created: function () {
    this.config = tinyConfig.config
  },
  methods: {
    loaded: function (event, editor) {
      this.editor = editor;
      this.content = this.value
      if( this.focused){
        editor.fire('focus')
      }
      if( this.readOnly) {
        this.editor.setMode('readonly');
      }
    },
  }
}
</script>
