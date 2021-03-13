<template>
  <div class="center">
    {{ message.nbResponse }} réponse(s).
    <span v-if="!isChild">
      <span> triés par : </span>
      <b-dropdown
        :text="tabSort[mySortedBy]"
        variant="outline-primary"
        size="sm"
      >
        <b-dropdown-item-button @click="changeSortBy(1)">{{
          tabSort[1]
        }}</b-dropdown-item-button>
        <b-dropdown-item-button @click="changeSortBy(2)">{{
          tabSort[2]
        }}</b-dropdown-item-button>
        <b-dropdown-item-button @click="changeSortBy(3)">{{
          tabSort[3]
        }}</b-dropdown-item-button>
      </b-dropdown>
      <span
        v-if="
          isType(message.type, 'evaluate') || isType(message.type, 'report')
        "
      >
        <b-button
          id="evaluate-btn"
          variant="outline-primary"
          size="sm"
          @click="connected && $emit('actionEvaluate')"
        >
          Evaluer </b-button
        >&nbsp;
        <b-popover
          v-if="!connected"
          target="evaluate-btn"
          placement="top"
          triggers="hover"
        >
          Vous devez vous connecter d'abord
        </b-popover>
      </span>
      <span v-if="replyAllowed">
        <b-button
          id="reply-btn"
          variant="outline-primary"
          size="sm"
          @click="connected && message.myVote && $emit('actionWriteMessage')"
        >
          répondre </b-button
        >&nbsp;
        <b-popover
          v-if="!connected"
          target="reply-btn"
          placement="top"
          triggers="hover"
        >
          Vous devez vous connecter d'abord
        </b-popover>
        <b-popover
          v-if="connected && !message.myVote"
          target="reply-btn"
          placement="top"
          triggers="hover"
        >
          Vous devez évaluer ce message<br />avant d'y répondre
        </b-popover>
      </span>
      <b-button
        v-if="message.parentId"
        variant="outline-primary"
        size="sm"
        @click="$emit('actionInOut')"
      >
        retour
      </b-button>
    </span>
    <span v-else>
      <b-button
        variant="outline-primary"
        @click="$emit('actionInOut')"
        size="sm"
      >
        Entrer
      </b-button>
    </span>
  </div>
</template>

<script>
const tabSort = ["", "Interêt", "meilleurs soutients", "meilleurs opposants"];
import { isType } from "@/config/typesMessage.js";

export default {
  name: "MessageFooter",
  props: ["message", "index", "sortedBy"],
  data: function () {
    return {
      tabSort: tabSort,
      mySortedBy: this.sortedBy,
      isType,
    };
  },
  computed: {
    isChild() {
      return typeof this.index === "number";
    },
    connected() {
      return this.$store.getters.getConnectedUser.pseudo;
    },
    replyAllowed() {
      return this.isAdmin || isType(this.message.type, "reply");
    },
  },
  methods: {
    changeSortBy(input) {
      this.mySortedBy = input;
      this.$emit("changeSortBy", input);
    },
  },
};
</script>

<style scoped>
.center {
  text-align: center;
}
</style>
