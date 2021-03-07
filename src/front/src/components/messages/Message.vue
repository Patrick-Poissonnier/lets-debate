<template>
  <div v-if="message" class="gridMessage">
    <div :class="responseType" :style="messageStyle" :key="message.id">
      <div class="gridEntete">
        <div class="avatar">
          <AuthorAvatar
            :pseudo="message.authorPseudo"
            :interest="true"
            :responseType="message.responseType"
          />
        </div>
        <div class="title">
          <div v-if="isChild" class="titleText">
            <a
              :href="uri('Debate', { id: message.id })"
              @click.prevent="goChild"
            >
              <span v-html="message.text.title" />
            </a>
          </div>
          <div v-else class="titleText" v-html="message.text.title" />
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
        </div>
        <div class="right">
          <div class="rightButton">
            <b-button
              v-if="isAdmin"
              @click="showWriteMessage(message)"
              variant="outline-primary"
              size="sm"
              >Admin</b-button
            >
            <b-button
              v-if="showText"
              style="text-align: 'right'"
              @click="showText = false"
              variant="outline-primary"
              size="sm"
            >
              -</b-button
            >
            <b-button
              v-else
              @click="showText = true"
              variant="outline-primary"
              size="sm"
              >+</b-button
            >
          </div>

          <div v-if="isType(message.type, 'evaluate')">
            <BarEval :obj="message" :interest="true" :agree="true" />
          </div>
          <div v-if="isType(message.type, 'report')">
            <b-img
              :style="styleImgReport"
              :id="message.id + 'popover-report'"
              src="/logo/signe-attention.png"
              width="32"
            />
            <b-popover
              :target="message.id + 'popover-report'"
              triggers="hover"
              placement="bottom"
            >
              <template #title>Signalements :</template>
              <b>
                <div
                  v-for="(item, key) in reportChoice"
                  :variant="item.variant"
                  :key="key"
                  :id="key"
                  :style="{ color: item.color }"
                >
                  <div v-if="item.value">
                    <div class="tabReport">
                      <div>{{ item.text }} :</div>
                      <div>{{ message.report[key] || 0 }}</div>
                    </div>
                  </div>
                </div>
              </b>
            </b-popover>
          </div>
        </div>
      </div>
      <div v-if="showText" v-html="message.text.text"></div>

      <div v-if="!isChild" class="bottom">
        <span> {{ message.nbResponse }} réponses. triés par : </span>
        <b-dropdown
          :text="tabSort[sortedBy]"
          variant="outline-primary"
          size="sm"
        >
          <b-dropdown-item-button @click="sortBy(1)">{{
            tabSort[1]
          }}</b-dropdown-item-button>
          <b-dropdown-item-button @click="sortBy(2)">{{
            tabSort[2]
          }}</b-dropdown-item-button>
          <b-dropdown-item-button @click="sortBy(3)">{{
            tabSort[3]
          }}</b-dropdown-item-button> </b-dropdown
        >&nbsp;
        <b-button
          v-if="
            isType(message.type, 'evaluate') || isType(message.type, 'report')
          "
          id="evaluate-btn"
          variant="outline-primary"
          size="sm"
          @click="
            connected && chowModalEvaluate({ message, callBack: cbNewVote })
          "
        >
          Evaluer </b-button
        >&nbsp;
        <b-popover
          v-if="
            isType(message.type, 'evaluate') ||
            (isType(message.type, 'report') && !connected)
          "
          target="evaluate-btn"
          placement="top"
          triggers="hover"
        >
          Vous devez vous connecter d'abord
        </b-popover>
        <b-button
          v-if="replyAllowed"
          id="reply-btn"
          variant="outline-primary"
          size="sm"
          @click="showWriteMessage()"
        >
          répondre </b-button
        >&nbsp;
        <b-popover
          v-if="replyAllowed && !connected"
          target="reply-btn"
          placement="top"
          triggers="hover"
        >
          Vous devez vous connecter d'abord
        </b-popover>
        <b-popover
          v-if="replyAllowed && connected && !message.myVote"
          target="reply-btn"
          placement="top"
          triggers="hover"
          >> Vous devez évaluer ce message<br />avant d'y répondre
        </b-popover>
        <b-button
          v-if="message.parentId"
          variant="outline-primary"
          size="sm"
          @click="goParent"
        >
          retour </b-button
        >&nbsp;
      </div>
      <div v-else class="bottom">
        <span> {{ message.nbResponse }} réponses. </span>
        <b-button variant="outline-primary" @click="goChild" size="sm">
          Entrer
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { isType } from "@/config/typesMessage.js";

import AuthorAvatar from "@/components/auth/AuthorAvatar.vue";
import BarEval from "@/components/BarEval.vue";
import { reportChoice, evaluatChoice } from "@/config/evaluat.js";

const tabSort = ["", "Interêt", "meilleurs soutients", "meilleurs opposants"];

export default {
  name: "Message",
  props: ["message", "index"],
  components: {
    AuthorAvatar,
    BarEval,
  },
  inject: ["chowModalEvaluate", "modalWriteMessage"],

  data() {
    return {
      showText: typeof this.index !== "number",
      sortedBy: this.$store.getters.getSortIndex,
      isChild: typeof this.index === "number",
    };
  },

  created: function () {
    this.isType = isType; // no vue reactivity
    this.reportChoice = reportChoice;
    this.tabSort = tabSort;
  },

  beforeUpdate: function () {},

  computed: {
    isAdmin() {
      return this.$store.getters.getConnectedUser.auth > 1;
    },
    connected() {
      return this.$store.getters.getConnectedUser.pseudo;
    },
    replyAllowed() {
      return this.isAdmin || isType(this.message.type, "reply");
    },
    styleImgReport() {
      if (this.showText) return { display: "block", margin: "1em auto" };
      else return { display: "none" };
    },

    messageStyle() {
      return {
        margin: "0.5em 0.5em 0 0.5em",
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
    showWriteMessage(message) {
      if (this.connected && this.message.myVote !== null) {
        this.editedMessage = message;
        this.modalWriteMessage({
          message,
          parentId: message ? message.parentId : this.message.id,
          callBack: this.cbEditMessage,
        });
      }
    },

    bgColor(value) {
      return evaluatChoice[value || 0];
    },
    goChild() {
      this.$store.dispatch("goChild", this.index);
    },
    goParent() {
      this.$store.dispatch("goAncestor", -1);
    },
    sortBy(index) {
      this.sortedBy = index;
      this.$store.dispatch("setChildsSort", index);
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
<style scoped>
.gridMessage {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-gap: 0px;
}
.gridParent {
  grid-column-start: span 20;
}
.gridAgree {
  grid-column-start: span 18;
  grid-column-end: 19;
}
.gridNone {
  grid-column-start: span 18;
  grid-column-end: 20;
}
.gridDisagree {
  grid-column-start: span 18;
  grid-column-end: 21;
}

.gridEntete {
  display: grid;
  grid-template-columns: 90px 1fr 128px;
  grid-gap: 5px;
}

.right {
  margin: 0.5em;
}
.rightButton {
  text-align: right;
}
.tabReport {
  display: grid;
  grid-template-columns: 100px 40px;
}

.evaluate {
  margin: 0.5em;
}

.adminText {
  text-align: left;
  font-weight: bold;
  color: orangered;
}
.titleText {
  font-size: 1.4em;
  font-weight: bold;
}
.bottom {
  text-align: center;
}
button {
  margin: 0.5em;
}
</style>