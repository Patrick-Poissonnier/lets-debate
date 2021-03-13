<template>
  <div :style="myVoteColor" v-if="childs.list.length">
    <Message
      v-for="(message, index) in childs.list"
      :key="index"
      :message="message"
      :index="index"
    />
  </div>
</template>

<script>
import Message from "@/components/messages/Message.vue";
import { evaluatChoice } from "@/config/evaluat.js";

export default {
  name: "ListMessage",
  props: ["parent"],
  components: {
    Message,
  },
  data: function () {
    return {
      curStart: 0,
      curLast: 0,
      evaluatChoice,
    };
  },
  computed: {
    childs: function () {
      return this.$store.getters.getChilds;
    },
    myVoteColor: function () {
      return {
        margin: "0 0 0 0.5em",
        borderStyle: "none none none solid",
        borderColor: this.bgColor(this.parent.myVote && this.parent.myVote.vote)
          .color,
        paddingLeft: "1em",
      };
    },
  },
  methods: {
    bgColor(value) {
      //      let vote = this.message.myVote && this.message.myVote.vote || 0
      //      console.log( value)
      return evaluatChoice[value || 0];
    },
  },
};
</script>
<style scoped>
</style>