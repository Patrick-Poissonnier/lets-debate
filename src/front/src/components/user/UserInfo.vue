<template>
  <div v-if="userInfo">
    <b-tabs content-class="mt-3">
      <b-tab title="public" active>
        <PublicInfo :user="userInfo" />
      </b-tab>
      <b-tab v-if="userInfo.private" title="privé">
        <PrivateInfo :user="userInfo" @changedUser="changedUser" />
      </b-tab>
      <!--    <b-tab v-if="userInfo.modo" title="modérarion" >
      <AdminUser :user="userInfo"/>
    </b-tab>-->
    </b-tabs>
  </div>
</template>

<script>
import libUser from "@/DAL/libUser";
import PublicInfo from "@/components/user/PublicInfo.vue";
import PrivateInfo from "@/components/user/PrivateInfo.vue";

export default {
  name: "UserInfo",
  props: {
    pseudo: String,
  },
  data: function () {
    return {
      userInfo: null,
    };
  },
  components: {
    PublicInfo,
    PrivateInfo,
  },
  created: async function () {
    if (this.pseudo === this.$store.getters.getConnectedUser.pseudo) {
      this.userInfo = Object.assign({}, this.$store.getters.getConnectedUser);
    } else {
      this.userInfo = await libUser.get(this.pseudo);
    }
  },
  methods: {
    changedUser(user) {
      //      console.log("changedUser");
      this.userInfo = user;
    },
  },
};
</script>

<style scoped>
</style>
