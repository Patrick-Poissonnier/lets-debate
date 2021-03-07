<template>
  <div>
    <div style="text-align: center">
      <h1>S'enregistrer</h1>
      <h4>
        La confidentialité de votre vie privée et de vos opinions est notre
        priorité.
        <br /><br />
      </h4>
    </div>
    <b-form ref="form" @reset="abort" @submit="handleSubmit">
      <div class="grid">
        <div class="colOne">pseudo :</div>
        <div class="colTwo">
          <b-form-input
            :disabled="!!user"
            style="width: 100px"
            id="input-pseudo"
            v-model="pseudo"
            size="20"
            :state="pseudoOk"
            v-on:focusout="validatePseudo()"
          >
          </b-form-input>
          <b-form-invalid-feedback id="input-pseudo-feedback">
            {{ pseudoError }}
          </b-form-invalid-feedback>
        </div>

        <div class="text">
          Pour garantir cette confidentialit&eacute;, tenez secret votre pseudo
          et&nbsp;:<br />
          <strong
            >ne choisissez ni votre nom ni un pseudo utilis&eacute; sur
            d&rsquo;autres sites.</strong
          ><br />
          Ainsi les moteurs de recherche ne pourront pas deviner qui se &laquo;
          cache &raquo; derri&egrave;re ce pseudo.<br />
        </div>

        <div class="colOne">email :</div>
        <div class="colTwo">
          <b-form-input
            style="width: 200px"
            id="input-email"
            type="email"
            v-model="email"
            size="40"
            :state="emailOk"
            v-on:focusout="validateEmail()"
          ></b-form-input>
          <b-form-invalid-feedback id="input-email-feedback">
            {{ emailError }}
          </b-form-invalid-feedback>
        </div>
        <div class="text">
          Facultatif mais :<br />
          vous ne pourrez pas dévérouiller votre compte si vous perdez votre mot
          de passe,<br />
          vous ne pourrez pas recevoire de notifications
        </div>

        <div class="colOne">mot de passe :</div>
        <div class="colTwo">
          <b-form-input
            style="width: 100px"
            id="input-pwd1"
            type="password"
            v-model="pwd1"
            size="20"
            :state="pwd1Ok"
            v-on:focusout="validatePwd1()"
          ></b-form-input>
          <b-form-invalid-feedback id="input-pwd1-feedback">
            {{ pwd1Error }}
          </b-form-invalid-feedback>
        </div>
        <div class="colOne">mot de passe :</div>
        <div class="colTwo">
          <b-form-input
            style="width: 100px"
            id="input-pwd2"
            type="password"
            v-model="pwd2"
            size="20"
            :state="pwd2Ok"
            v-on:focusout="validatePwd2()"
          ></b-form-input>
          <b-form-invalid-feedback id="input-pwd2-feedback">
            {{ pwd2Error }}
          </b-form-invalid-feedback>
        </div>

        <div class="colOne">rester connecté ?</div>
        <div class="colTwo">
          <b-form-checkbox
            :v-if="!user"
            id="checkbox-1"
            switch
            v-model="stayConnected"
            name="checkbox-1"
            value="true"
            unchecked-value=""
          ></b-form-checkbox>
        </div>
        <div style="grid-column-start: span 2; margin: 2em; line-height: 1em">
          <p>&nbsp;Nos engagement&nbsp;:</p>
          <ul>
            <li>
              <p>
                Nous n&rsquo;utilisons pas de cookies (sauf 1 pour
                s&eacute;curiser la connexion avec le serveur)
              </p>
            </li>
            <li>
              <p>
                Nous ne collectons aucune donn&eacute;es sur vous ou votre
                ordinateur si ce n&rsquo;est celles que vous postez
                explicitement sur ce site.
              </p>
            </li>
            <li>
              <p>
                Ces donn&eacute;es restent votre propri&eacute;t&eacute;, nous
                ne les divulguerons &agrave; aucun tiers (personnes,
                entreprises, organisations, etc).
              </p>
            </li>
          </ul>
          <p>&nbsp;</p>
          <p>Vos engagement&nbsp;:</p>
          <ul>
            <li>
              <p>
                Respecter la loi Fran&ccedil;aise qui interdit les appels
                &agrave; la violence, les propos racistes, le
                n&eacute;gationnisme, etc
              </p>
            </li>
            <li>
              <p>
                Respecter notre charte que vous acceptez en vous enregistrant et
                proscrit&nbsp;:
              </p>
            </li>
          </ul>
          <p style="margin-left: 1.25cm; margin-bottom: 0cm">
            les attaques sur les personnes et les propos haineux ou agressifs.
            S&rsquo;il est toujours possible de critiquer les id&eacute;es
            (c&rsquo;est m&ecirc;me la raison d&rsquo;&ecirc;tre de ce site) les
            personnes doivent &ecirc;tre respect&eacute;s.
          </p>
          <p>&nbsp;</p>
          <ul>
            <li>
              <p>
                M&ecirc;me si le concept de fake-news et particuli&egrave;rement
                ambigu&euml;, vous vous engagez &agrave; ne pas diffusez de
                fausses informations.
              </p>
            </li>
            <li>
              <p>
                Vous vous engagez &agrave; nous signaler (par
                l&rsquo;interm&eacute;diaire du bouton &laquo; &eacute;valuez
                &raquo;) tous les manquements &agrave; cette charte dans les
                messages que vous lirez.
              </p>
            </li>
          </ul>
        </div>
        <div class="colOne">
          <b-button type="reset" variant="primary" style="margin: 1em">
            Annuler
          </b-button>
        </div>
        <div class="colTwo">
          <b-button
            type="submit"
            variant="primary"
            :disabled="!formOk"
            style="margin: 1em"
          >
            S'enregistrer
          </b-button>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
const regEmail = new RegExp("^.+@.+\\..{2}");
const regPseudo = new RegExp("^([A-Za-z0-9_\\-\\._éèêàôûù])+$");

export default {
  name: "Register",
  props: ["user"],
  data() {
    return {
      email: "",
      pseudo: "",
      pwd1: "",
      pwd2: "",
      emailOk: null,
      pseudoOk: null,
      pwd1Ok: null,
      pwd2Ok: null,
      emailError: "",
      pseudoError: "",
      pwd1Error: "",
      pwd2Error: "",
      stayConnected: "",
    };
  },
  computed: {
    formOk() {
      return this.emailOk && this.pseudoOk && this.pwd1Ok && this.pwd2Ok;
    },
  },

  Created: function () {
    if (this.user) {
      this.email = this.user.private.email;
      this.pseudo = this.user.pseudo;
      this.pwd1 = this.pwd2 = this.user.private.password;
      this.pseudoOk = true;
    }
  },
  methods: {
    validateEmail() {
      this.emailOk = true || regEmail.test(this.email);
      this.emailError = this.emailOk || "Cette email n'est pas valide";
    },

    validatePseudo() {
      this.pseudoOk = this.pseudo.length > 2;
      this.pseudoError =
        this.pseudoOk || "Le pseudo doit comorter au moins 3 caractères";
      if (this.pseudoOk) {
        this.pseudoOk = regPseudo.test(this.pseudo);
        this.pseudoError =
          this.pseudoOk ||
          " Le pseudo ne doit pas contenir de caractères spéciaux";
      }
    },

    validatePwd1() {
      this.pwd1Ok = this.pwd1.length > 2;
      this.pwd1Error =
        this.pwd1Ok || "Le mot de passe doit comorter au moins 3 caractères";

      if (this.pwd2) {
        this.validatePwd2();
      }
    },

    validatePwd2() {
      this.pwd2Ok = this.pwd1 === this.pwd2;
      this.pwd2Error =
        this.pwd2Ok || "Les mots de passes ne sont pas identiques";
    },

    abort(evt) {
      evt.preventDefault();
      this.$store.commit("historyBack");
    },

    async handleSubmit(evt) {
      evt.preventDefault();
      let response;
      if (this.user) {
        response = await this.$store.dispatch("updateUser", {
          email: this.email,
          password: this.pwd1,
        });
      } else {
        response = await this.$store.dispatch("newUser", {
          pseudo: this.pseudo,
          email: this.email,
          password: this.pwd1,
          persist: this.stayConnected,
        });
      }
      if (typeof response.data === "object") {
        if (this.user) {
          this.$store.commit("historiqueBack");
        }
      } else {
        if (response.data === "pseudo") {
          this.pseudoError = "l'utilisateur existe déjà";
          this.pseudoOk = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
}
.text {
  grid-column-start: span 2;
  text-align: center;
}
.colOne {
  margin-top: 1em;
  line-height: 2em;
  text-align: right;
  vertical-align: middle;
}
.colTwo {
  margin-top: 1em;
  line-height: 2em;
  text-align: left;
  vertical-align: middle;
}
</style>