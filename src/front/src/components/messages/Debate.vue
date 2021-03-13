<template>
  <div v-if="message" :key="pseudo + id">
    <Ancestors />
    <div class="debate">
      <Message :message="message" :index="null" class="mainMessage" />
      <ListMessage :parent="message" class="ChildMessage" />
    </div>
  </div>
</template>

<script>
import Ancestors from "@/components/messages/Ancestors.vue";
import Message from "@/components/messages/Message.vue";
import ListMessage from "@/components/messages/ListMessage.vue";
import { evaluatChoice } from "@/config/evaluat.js";

export default {
  name: "Debate",
  props: ["id"],
  components: {
    Ancestors,
    Message,
    ListMessage,
  },
  data: function () {
    return {};
  },
  computed: {
    message() {
      return this.$store.getters.getMainMesssage;
    },
    pseudo() {
      return this.$store.getters.getConnectedUser.pseudo;
    },
    colorVote() {
      let vote = (this.message.myVote && this.message.myVote.vote) || 0;
      return evaluatChoice[vote].bgColor;
    },
  },

  created: function () {
    this.$store.dispatch("loadDebate", this.id);
  },
  beforeUpdate: function () {
    this.$store.dispatch("loadDebate", this.id);
  },
  updated: function () {
    const DomDebate = document.querySelector(".debate");
    if (DomDebate) {
      DomDebate.scrollTop = this.$store.getters.getScrollPos;
    }
  },
};
</script>

<style scoped>
.debate {
  margin: 0 0 0 0.5em;
  max-height: calc(100vh - 75px) !important;
  height: 100%;
  overflow-y: scroll;
}
.left {
  float: left;
}
</style>