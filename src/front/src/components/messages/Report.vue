<template>
  <b-modal id="report" v-if="message" title="message.titre" size="xs">
    <b-form-group label="Individual radios">
      <b-form-radio v-for="(item, key) in reportChoice"
        :key="key"
        v-model="selected"
        :style="{color: item.color}"
        :value="key">
        {{item.text}} 
      </b-form-radio>
    </b-form-group>
    <b-button @click="close">
      fermer
    </b-button>
    
  </b-modal>
</template>
<script>
import {reportChoice} from "@/config/evaluat"

export default {
  name: "Report",
  props: ["message"],
  data: function() {
    return {
      selected : null,
      reportChoice: reportChoice,
    }
  },
  onmount() {
    this.selected = this.message.myVote && this.message.myVote.report
  },
  computed: {
  },
  methods: {
    stringColorSignal( item) {
      return item.color
    },

    valueItem( item) {
      if( this.message.report){
        return this.message.report[ item] || 0
      } else return 0
    },
    close() {
      this.$nextTick(() => {
          this.$bvModal.hide("report");
      });
    }
  }
}
</script>