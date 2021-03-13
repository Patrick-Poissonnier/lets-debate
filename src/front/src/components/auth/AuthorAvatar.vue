<template>
  <div
    v-if="user"
    class="avatar"
    :style="{ borderColor: evaluatChoice[responseType || 0].color }"
  >
    <b-img :src="avatarURL" width="74" />
    <br />
    <BarEval :v-if="interest" :obj="user" :interest="true" :agree="false" />
  </div>
</template>

<script>
import BarEval from "@/components/BarEval.vue";
import { evaluatChoice } from "@/config/evaluat.js";

export default {
  name: "AuthorAvatar",
  props: ["pseudo", "interest", "responseType"],
  components: {
    BarEval,
  },
  data() {
    return {
      evaluatChoice: evaluatChoice,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getAuthor(this.pseudo);
    },
    avatarURL() {
      return this.user ? "Avatar/" + this.user.avatar : "";
    },
  },

  created: function () {
    this.$store.dispatch("setAuthor", this.pseudo);
  },
  destroyed: function () {
    this.$store.commit("releaseAuthor", this.pseudo);
  },

  methods: {
    uri(component, props) {
      return `http:${component}?${JSON.stringify(props)}`;
    },
    goUserInfo() {
      //event) {
      //      console.log( event)
      this.$store.commit("setMainPage", {
        component: "UserInfo",
        props: { pseudo: this.user.pseudo },
      });
    },
  },
};
</script>

<style scoped>
.avatar {
  padding: 0.5em;
  display: inline-block;
  border-style: none;
  text-align: center;
}
</style>