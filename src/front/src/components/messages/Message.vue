<template>
  <div class="gridMessage">
    <div :class="responseType" :style="messageStyle" :key="message.id">
      <MessageHeader
        class="messageHeader"
        :message="message"
        :showText="showText"
        @changeShowText="showText = !showText"
        @titleClicked="titleClicked"
        @goUserInfo="goUserInfo"
        @actionWriteMessage="showWriteMessage"
      />

      <AuthorAvatar
        class="left avatar"
        :pseudo="message.authorPseudo"
        :interest="true"
        :responseType="message.responseType"
      />
      <div v-if="isType(message.type, 'evaluate')" class="right">
        <BarEval :obj="message" :interest="true" :agree="true" />
        <Report :message="message" class="report" height="32" />
      </div>

      <div class="textMessage">
        <div
          v-if="message.text.adminText"
          class="adminText"
          v-html="message.text.adminText"
        ></div>
        <div
          v-if="message.text.resume"
          class="textResume"
          v-html="message.text.resume"
        ></div>
        <div v-if="showText" v-html="message.text.text"></div>
      </div>
      <div class="bottom">
        <MessageFooter
          :message="message"
          :index="index"
          :sortedBy="sortedBy"
          @changeSortBy="changeSortBy"
          @actionInOut="actionInOut"
          @actionEvaluate="chowModalEvaluate({ message, callBack: cbNewVote })"
          @actionWriteMessage="showWriteMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MessageHeader from "@/components/messages/MessageHeader";
import MessageFooter from "@/components/messages/MessageFooter";
import AuthorAvatar from "@/components/auth/AuthorAvatar.vue";
import BarEval from "@/components/BarEval.vue";
import Report from "@/components/messages/Report";

import { reportChoice, evaluatChoice } from "@/config/evaluat.js";
import { isType } from "@/config/typesMessage.js";

export default {
  name: "Message",
  props: ["message", "index"],
  components: {
    MessageHeader,
    MessageFooter,
    AuthorAvatar,
    BarEval,
    Report,
  },
  inject: ["chowModalEvaluate", "modalWriteMessage"],

  data() {
    return {
      showText: typeof this.index !== "number",
      sortedBy: this.$store.getters.getSortIndex,
    };
  },

  created: function () {
    // no vue reactivity
    this.isChild = typeof this.index === "number";
    this.isType = isType;
    this.reportChoice = reportChoice;
  },

  computed: {
    isAdmin() {
      return this.$store.getters.getConnectedUser.auth > 1;
    },
    connected() {
      return this.$store.getters.getConnectedUser.pseudo;
    },

    messageStyle() {
      return {
        margin: "0em 0.5em 0 0.5em",
        paddingTop: "0.5em",
        borderStyle: "none none none solid",
        borderColor: this.bgColor(
          this.message.myVote && this.message.myVote.vote
        ).color,
        backgroundColor: this.bgColor(this.message.responseType).bgColor,
      };
    },
    responseType() {
      let result;
      if (this.isChild) {
        switch (this.message.responseType) {
          case 3:
            result = { gridDisagree: true };
            break;
          case 4:
            result = { gridAgree: true };
            break;
          default:
            result = { gridNone: true };
        }
      } else {
        result = { gridParent: true };
      }
      return result;
    },
  },

  methods: {
    goUserInfo(pseudo) {
      this.$store.commit("setMainPage", {
        component: "UserInfo",
        props: { pseudo },
      });
    },
    showWriteMessage(message) {
      //      console.log("showWriteMessage" + message.id);
      if (this.connected) {
        this.editedMessage = message;
        this.modalWriteMessage({
          message,
          parentId: message ? message.parentId : this.message.id,
          callBack: this.cbEditMessage,
        });
      }
    },
    changeSortBy(input) {
      this.sortedBy = input;
      this.$store.dispatch("setChildsSort", input);
    },
    actionInOut() {
      if (this.isChild) {
        this.goChild();
      } else {
        this.goParent();
      }
    },
    titleClicked() {
      //      console.log("titleClicked");
      if (this.isChild) {
        this.goChild();
      } else {
        document.querySelector(".debate").scrollTop = 0;
      }
    },
    goChild() {
      //      console.log("goChild");
      this.$store.dispatch("goChild", this.index);
    },
    goParent() {
      this.$store.dispatch("goAncestor", -1);
    },

    bgColor(value) {
      return evaluatChoice[value || 0];
    },
    uri(component, props) {
      return `http:${component}?${JSON.stringify(props)}`;
    },

    cbEditMessage(message) {
      if (this.editedMessage) {
        this.$store.commit("updateMessage", { message, index: this.index });
      } else {
        this.$store.commit("newMessage", message);
      }
    },

    cbNewVote(message) {
      this.$store.dispatch("newVote", message);
    },
  },
};
</script>

<style>
.btn {
  margin-left: 0.5em;
}
</style>

<style scoped>
.left {
  float: left;
  min-width: 90px;
  text-align: center;
}

.avatar {
  max-width: 90px;
}

.right {
  clear: right;
  float: right;
  width: 100px;
  margin: 0 0.5em;
}
.report {
  margin: 0.5em;
  text-align: center;
}
.mainMessage .messageHeader {
  position: sticky;
}

.gridMessage {
  padding-top: 0.5em;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-gap: 0px;
}
.gridParent {
  grid-column-start: span 20;
  position: relative;
}
.gridAgree {
  grid-column-start: span 18;
  grid-column-end: 19;
  position: relative;
}
.gridNone {
  grid-column-start: span 18;
  grid-column-end: 20;
  position: relative;
}
.gridDisagree {
  grid-column-start: span 18;
  grid-column-end: 21;
  position: relative;
}
.textMessage {
  padding-bottom: 1.5em;
}
.adminText {
  text-align: left;
  font-weight: bold;
  color: orangered;
}
.bottom {
  position: absolute;
  bottom: 0.5em;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
</style>