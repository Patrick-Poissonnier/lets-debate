<template>
  <div class="header">
    <div class="left">
      <b-img
        src="/Logo/logo-48.png"
        alt="home"
        rounded="circle"
        :style="{ margin: '1em' }"
        @click="
          $store.commit('setMainPage', {
            component: 'Home',
            props: {},
          })
        "
      />
    </div>
    <div class="center">
      <a
        :href="uri('Debate', { id: 2 })"
        @click.prevent="
          $store.commit('setMainPage', {
            component: 'Debate',
            props: { id: 2 },
          })
        "
      >
        <h3>Débatons !</h3>
        <h6>(prototype)</h6>
      </a>
    </div>
    <div class="right" :style="{ margin: '1em' }">
      <b-dropdown v-if="connectedUser.pseudo" right variant="outline-primary">
        <template #button-content>
          {{ connectedUser.pseudo }}
          <img :src="'Avatar/' + connectedUser.avatar" width="32" height="32" />
        </template>
        <b-dropdown-item-button @click="$bvModal.show('modal-logout')">
          se deconnecter
        </b-dropdown-item-button>
        <b-dropdown-item-button
          @click="
            $store.commit('setMainPage', {
              component: 'UserInfo',
              props: { pseudo: connectedUser.pseudo },
            })
          "
        >
          mes infos
        </b-dropdown-item-button>
        <b-dropdown-item-button
          v-if="connectedUser.auth > 1"
          @click="
            $store.commit('setMainPage', {
              component: 'Administration',
              props: {},
            })
          "
        >
          administration
        </b-dropdown-item-button>
      </b-dropdown>
      <b-dropdown v-else right text="connexion">
        <b-dropdown-item-button @click="$bvModal.show('modal-login')"
          >se connecter</b-dropdown-item-button
        >
        <b-dropdown-item-button
          @click="
            $store.commit('setMainPage', { component: 'Register', props: {} })
          "
          >s'enregister</b-dropdown-item-button
        >
      </b-dropdown>
    </div>
    <ModalLogin />
    <ModalLogout />
  </div>
</template>

<script>
import ModalLogin from "@/components/auth/ModalLogin.vue";
//import ModalRegister from "@/components/auth/ModalRegister.vue";
import ModalLogout from "@/components/auth/ModalLogout.vue";

export default {
  name: "Header",
  computed: {
    connectedUser() {
      return this.$store.getters.getConnectedUser;
    },
  },
  methods: {
    uri(component, props) {
      return `http:${component}?${JSON.stringify(props)}`;
    },
  },
  components: {
    ModalLogin,
    ModalLogout,
  },
};
</script>
<style scoped>
.header {
  display: grid;
  grid-template-columns: repeat(3, 4fr);
  grid-gap: 10px;
  height: 75px;
  vertical-align: middle;
  background-color: darkgray;
}
.left {
  vertical-align: middle;
  text-align: left;
}
.center {
  vertical-align: middle;
  text-align: center;
}
.right {
  vertical-align: middle;
  text-align: right;
}
</style>
