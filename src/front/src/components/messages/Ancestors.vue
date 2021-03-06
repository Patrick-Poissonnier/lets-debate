<template>
<div v-if='ancestors' class='listancestor'>
  
  <div v-for="(obj, index) in ancestors" :key="index">
    <img src="Avatar/fleche.png" style="float: left;" width='25px'/>
    <a :href="uri('Debate', {id : obj.message.id})" 
      @click.prevent="goAncestor(index)">
      
      <span v-html="obj.message.text.title" class="ancestor"/>
    </a>
  </div>
</div>
</template>

<script>
export default {
  name: "Ancestors",
  props: [],
  data: function() {
    return {
      refAncestor: null,
    }
  },
  computed: {
    ancestors () {
      return this.$store.getters.getAncestors
    },
  },
  methods: {
    uri( component, props) {
      return `http:${component}?${JSON.stringify(props)}`
    },

    goAncestor( index) {
      this.$store.dispatch( 'goAncestor', index)
    },

    
  },
  mounted : function () {
    this.refAncestor = document.querySelector('.listancestor')
    this.refAncestor.scrollTop = 
      this.refAncestor.scrollHeight - this.refAncestor.clientHeight
  },
  updated: function() {
    this.refAncestor.scrollTop = 
      this.refAncestor.scrollHeight - this.refAncestor.clientHeight
  }
}

</script>
<style scoped>
.listancestor  {
  max-height: 65px ;
  overflow-y: auto;
  margin-left: 2em;
}
.ancestor >>> p {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  margin-left: 1.5em;
}
</style>