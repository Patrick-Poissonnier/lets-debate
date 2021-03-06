<template>
<div v-if="userInfo">
  <b-tabs content-class="mt-3">
    <b-tab title="public" active>
      <PublicInfo :user="userInfo"/>
    </b-tab>
    <b-tab v-if="userInfo.private" title="privé">
      <PrivateInfo :user="userInfo" @updateUser="updateUser"/>
    </b-tab>
<!--    <b-tab v-if="userInfo.modo" title="modérarion" >
      <AdminUser :user="userInfo"/>
    </b-tab>-->
  </b-tabs>
</div>
</template>

<script>
import axios from "@/lib/myAxios"

import PublicInfo from '@/components/user/PublicInfo.vue'
import PrivateInfo from '@/components/user/PrivateInfo.vue'


export default {
  name: "UserInfo",
  props: {
    pseudo: String,
  },
  data: function() {
    return {
      userInfo: null,
    }
  },
  components:{
    PublicInfo,
    PrivateInfo,
  },
  created: function () {
    if( this.pseudo === this.$store.getters.getconnectedUser.pseudo) {
      this.userInfo = this.$store.getters.getconnectedUser
    } else {
      axios.post("user/getUser/", { pseudo: this.pseudo, text:true,})
      .then( response => {
 //       console.log(response)
        if(typeof response.data !== "string") {
          this.userInfo = response.data
        } else {
          console.log( response.data )
        }
      })
      .catch( err => {
        console.log( err)
      })
    }
  },
  methods: {
    updateUser( user) {
//      console.log( user)
      this.userInfo = user
      this.$store.commit('updateUser', user)
    }
},
}
</script>

<style scoped>

</style>
