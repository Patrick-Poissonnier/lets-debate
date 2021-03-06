<template>
    <b-modal id="modal-logout" title='Se deconnecter'
      @ok="handleOk"
    > vraiment ?
    </b-modal>
</template>

<script>
import axios from "@/lib/myAxios"

export default {
  name: 'modal-logout',
  methods: {
    handleOk () { 
      axios.post("user/logout/", {})
      .then( ()=>{
        this.$store.dispatch('logout')
      })
    }
  }
}
</script>
