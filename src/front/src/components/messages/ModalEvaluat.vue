<template>
  <b-modal id="ModalEvaluat" v-if="message" size="lg" @change="change">
    <template #modal-title="">
      votre évaluation pour :
      <span v-html="message.text.title" />
    </template>

    <div class="grid">
      <div class="first_col">
        <b-form-group>
          <b-form-radio
            v-for="(item, key) in evaluatChoice"
            v-model="selected"
            :key="key"
            :style="{ color: item.color }"
            :value="item.value"
          >
            {{ item.text }}
            <p />
          </b-form-radio>
        </b-form-group>
      </div>
      <div class="second_col text-center">
        <div>n'ésitez pas a nous signaler les messages inconvenants.</div>
        <div>Mais n'en abusez pas !</div>
        <p />
        <b-img src="/logo/signe-attention.png" width="40" />
        <b-dropdown id="Signaler" :text="signalText" variant="warning">
          <b-dropdown-item-button
            v-for="(item, key) in reportChoice"
            :key="key"
            :id="key"
            v-on:click="newReport = key"
          >
            {{ item.text }}
          </b-dropdown-item-button>
        </b-dropdown>
      </div>
    </div>
    <b-alert v-model="returnSuccess" variant="success">
      Votre action a bien été enregistrée
    </b-alert>
    <b-alert v-model="returnErreur" variant="danger">
      Erreur, votre action n'a pu être enregistrée
    </b-alert>

    <template v-slot:modal-footer="{}">
      <b-button
        type="submit"
        variant="outline-primary"
        @click="handleOk()"
        :disabled="!change || returnErreur || returnSuccess"
      >
        valider
      </b-button>
      <b-button
        v-if="oldVote"
        variant="outline-primary"
        @click="handleDelete()"
        :disabled="returnErreur || returnSuccess"
      >
        supprimer
      </b-button>
      <b-button type="reset" variant="outline-primary" @click="handleCancel()">
        {{ textQuit }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { evaluatChoice, reportChoice } from "@/config/evaluat";
import libMessage from "@/DAL/libMessage";

export default {
  name: "ModalEvaluat",
  props: ["message", "callBack"],
  components: {},
  data: function () {
    return {
      //      reportText: "signaler",
      option: "cancel",
      textQuit: "annuler",
      returnSuccess: false,
      returnErreur: false,
      selected: null,
      oldVote: null,
      oldReport: null,
      newReport: null,
      evaluatChoice,
      reportChoice,
    };
  },

  /*   created() {
    console.log( 'modalEvaluat created')
  },
 */
  computed: {
    isChanged() {
      return (
        this.oldVote !== this.selected || this.oldReport !== this.newReport
      );
    },
    signalText() {
      return this.newReport ? reportChoice[this.newReport].text : "Signaler";
    },
  },
  methods: {
    change: function () {
      this.option = "cancel";
      this.textQuit = "annuler";
      this.returnSuccess = false;
      this.returnErreur = false;
      this.oldVote = this.selected =
        (this.message && this.message.myVote && this.message.myVote.vote) ||
        null;
      this.oldReport = this.newReport =
        (this.message && this.message.myVote && this.message.myVote.report) ||
        null;
    },
    handleOk() {
      if (this.oldVote || this.oldReport) {
        if (this.change) {
          this.sendAction("change");
        } else {
          this.sendAction("delete");
        }
      } else {
        this.sendAction("evaluat");
      }
    },
    handleDelete() {
      this.selected = 0;
      this.sendAction("delete");
    },
    handleCancel() {
      //      if( (this.option === "cancel") || (this.option === "retour")) {
      this.$nextTick(() => {
        this.$bvModal.hide("ModalEvaluat");
      });
      //      }
    },

    async sendAction(action) {
      //      console.log( action)
      this.textQuit = "retour";

      const data = {
        messageId: this.message.id,
        evaluate: this.selected || 0,
        report: this.newReport || 0,
        action,
      };
      const message = await libMessage.updateVote(data);
      if (message !== null && typeof message === "object") {
        this.callBack(message);
      }
      this.returnErreur = !message;
      this.returnSuccess = !this.returnErreur;
    },
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  vertical-align: top;
}
.close {
  float: right;
  padding: 1em;
}
.titre {
  text-align: left;
}

.first_col {
  grid-column: 1;
  margin: auto;
}

.second_col {
  grid-column: 2;
  margin: auto;
}
</style>