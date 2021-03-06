<template>
  <b-modal
    id="modal-login"
    title="Se connecter"
    @show="resetModal"
    @ok="handleOk"
  >
    <b-form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group id="input-pseudo" label="pseudo" label-for="input-pseudo">
        <b-form-input
          id="input-pseudo"
          v-model="pseudo"
          :state="pseudoOk"
          v-on:focusout="validatePseudo()"
        ></b-form-input>
        <b-form-invalid-feedback id="input-pseudo-feedback">{{
          pseudoError
        }}</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-pwd1" label="mot de passe" label-for="input-pwd1">
        <b-form-input
          id="input-pwd1"
          type="password"
          v-model="pwd1"
          :state="pwd1Ok"
          v-on:focusout="validatePwd1()"
        ></b-form-input>
        <b-form-invalid-feedback id="input-pwd1-feedback">{{
          pwd1Error
        }}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-checkbox
        id="checkbox-1"
        switch
        v-model="stayConnected"
        name="checkbox-1"
        value="true"
        unchecked-value
        >rester connecté</b-form-checkbox
      >
    </b-form>
  </b-modal>
</template>

<script>
import axios from "@/lib/myAxios"

export default {
  name: "modal-login",
  data() {
    return {
      pseudo: "",
      pwd1: "",
      pseudoOk: null,
      pwd1Ok: null,
      pseudoError: "",
      pwd1Error: "",
      stayConnected: "",
    };
  },
  methods: {
    validatePseudo() {
      this.pseudoOk = this.pseudo.length > 2
      this.pseudoError =
        this.pseudoOk || "Le pseudo doit comorter au moins 3 caractères"
    },

    validatePwd1() {
      this.pwd1Ok = this.pwd1.length > 2
      this.pwd1Error =
        this.pwd1Ok || "Le mot de passe doit comorter au moins 3 caractères"
    },

    resetModal() {
      this.pseudo = ""
      this.pwd1 = ""
      this.pseudoOk = null
      this.pwd1Ok = null
      this.pseudoError = ""
      this.pwd1Error = ""
      this.stayConnected = ""
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    handleSubmit() {
      if( !(this.pseudoOk && this.pwd1Ok)) {
        return;
      }

      axios
        .post("user/login/", { pseudo: this.pseudo, password: this.pwd1, persist: this.stayConnected })
        .then((response) => {
          if( typeof response.data === "object") {
//            Object.assign( response.data, jwtDecode( response.data.userAccess))
            this.$store.dispatch("login", response.data)
            
            this.$nextTick(() => {
              this.$bvModal.hide("modal-login")
            })
          } else {
            if( response.data === "pseudo") {
              this.pseudoError = "L'utilisateur n'existe pas"
              this.pseudoOk = false
            } else if( response.data === "password") {
              this.pwd1Error = "Le mot de passe est incorecte"
              this.pwd1Ok = false
            } 
          }
        })
        .catch((error) => {
          console.log(error.message || error.toString())
        });
    },
  },
};
</script>
