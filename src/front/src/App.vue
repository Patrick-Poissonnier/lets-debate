<template>
  <div id="app">
    <Header />
    <component :is="mainPage.component" v-bind="mainPage.props" />

    <ModalEvaluat v-bind="propsModalEvaluat" />
    <WriteMessage v-bind="propsWriteMessage" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Home from "@/components/Home.vue";
import UserInfo from "@/components/user/UserInfo.vue";
import Message from "@/components/messages/Message.vue";
import ListMessage from "@/components/messages/ListMessage.vue";
import Register from "@/components/auth/Register.vue";
import Administration from "@/components/administration/Administration.vue";
import Debate from "@/components/messages/Debate.vue";

import ModalEvaluat from "@/components/messages/ModalEvaluat.vue";
import WriteMessage from "@/components/messages/WriteMessage.vue";

export default {
  name: "app",
  data: function () {
    return {
      propsModalEvaluat: {},
      propsWriteMessage: {},
    };
  },
  computed: {
    mainPage() {
      return this.$store.getters.getMainPage;
    },
  },
  components: {
    Header,
    Home,
    UserInfo,
    Register,
    Message,
    ListMessage,
    Administration,
    Debate,
    ModalEvaluat,
    WriteMessage,
  },

  provide: function () {
    return {
      chowModalEvaluate: this.chowModalEvaluate,
      modalWriteMessage: this.modalWriteMessage,
    };
  },

  mounted: function () {
    window.onpopstate = this.historyBack;
    this.$store.dispatch("initStore", window.location);
  },

  destroyed: function () {
    window.removeEventListener("onpopstate", this.navControl);
  },

  methods: {
    chowModalEvaluate(propsModalEvaluat) {
      this.propsModalEvaluat = propsModalEvaluat;
      this.$nextTick(() => {
        this.$bvModal.show("ModalEvaluat");
      });
    },
    modalWriteMessage(propsWriteMessage) {
      this.propsWriteMessage = propsWriteMessage;
      this.$nextTick(() => {
        this.$bvModal.show("WriteMessage");
      });
    },
    historyBack: function (event) {
      this.$store.commit("historyBack", event.state);
    },
  },
};
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;

  max-height: 100% !important;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
