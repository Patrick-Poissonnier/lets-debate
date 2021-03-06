<template>
  <b-modal id="WriteMessage" size="xl"
      @change="update"
      title="Votre réponse">
  
    <form >
      <div v-if="isAdmin" style="display: grid; grid-template-columns: repeat(3, 4r)">
        <div style="grid-column: 1">
          <b-form-checkbox
            switch
            v-model="evaluate"
            :value="typesMessage.evaluate"
            :unchecked-value="0"
            >évaluer</b-form-checkbox
          >
          <b-form-checkbox
            switch
            v-model="reply"
            :value="typesMessage.reply"
            :unchecked-value="0"
            >répondre</b-form-checkbox
          >
          <b-form-checkbox 
            switch
            v-model="text"
            :value="typesMessage.text"
            :unchecked-value="0"
          >
            type texte <img src="logo/help.png" width="20" id="help1"/>
            <b-popover target="help1" triggers="hover" placement="top">
              <template #title><b>type texte :</b></template>
                Désactive tous les controles d'un message normal, seul le champ texte est affiché,
                à vous de créer les liens pour naviguer dans le site.
            </b-popover>
          </b-form-checkbox>
        </div>
        <div style="grid-column: 2">
          report
        </div>
        <div style="grid-column: 3">
          report - abusivReport
        </div>
        <p/>
      </div>
      <div v-else>
        <textarea id="titre" :focused="true" class="text"
          placeholder="saisissez votre titre"
          v-model="newText.title"
        />
        <p/>
        <textarea v-if="isType(newType, 'resume')" 
          id="resume" class="text"
          placeholder="saisissez votre resumé"
          v-model="newText.resume"
        />
      </div>

      <div class="my-toolbar"/>
      <TinyEditor :hidden="!isAdmin" :focused="true" 
        v-model="newText.title"
        :value="newText.title"
        placeholder="votre titre (obligatoire)"
        ref="title"/>
      <TinyEditor :hidden="!isAdmin" 
        v-model="newText.adminText"
        :value="newText.adminText"
        placeholder="texte pour la modération du message"
        ref="adminText"/>
      <TinyEditor :hidden="!isAdmin || !isType(newType, 'resume')" 
        v-model="newText.resume"
        :value="newText.resume"
        placeholder="resumé ( conseillé si le texte est long)"
        ref="resume"/>
      <TinyEditor 
        v-model="newText.text"
        :value="newText.text"
        placeholder="votre texte"
        ref="text"/>
        <b-alert v-model="returnSuccess" variant="success">
          Votre message à bien été enregistré
        </b-alert>
        <b-alert v-model="returnErreur" variant="danger">
          Votre message n'à pu être enregistré
        </b-alert>
    </form>
    <template #modal-footer>
      <b-button variant="primary" v-on:click="register()"
        :disabled="returnSuccess||returnErreur"> 
        enregistrer
      </b-button>
      <b-button variant="alert" v-on:click="quite()">
        quitter
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import {isType, typesMessage} from '@/config/typesMessage'
import libMessage from '@/lib/libMessage'
import TinyEditor from "@/components/TinyEditor.vue"

const cleanText = {
    title: '',
    adminText: '',
    resume: '',
    text: '',
}
Object.freeze( cleanText)

export default {
  name: "writeMessage",
  props: ["message", "parentId", "callBack"],
  data() {
    return {
      newText: cleanText,
      newType: null,
      returnSuccess: false,
      returnErreur: false,
      
      evaluate: typesMessage.evaluate,
      reply: typesMessage.reply,
      text: typesMessage.text,
      isType: isType,
      typesMessage: typesMessage,
      result: null,
    };
  },
  components: {
    TinyEditor,
  },
  
  computed: {
    isAdmin() {
      const connectedUser = this.$store.getters.getconnectedUser
      return  connectedUser && (connectedUser.auth > 1)
    },
  },

  methods: {
    update() {
//      console.log( 'upadate')
      if( !this.message) {
        this.newText = Object.assign( {}, cleanText)
        this.newType = typesMessage.standard
      } else {
         this.newText = Object.assign( {}, this.message.text)
         this.newType = this.message.type 
      }
      
      this.evaluate = this.newType & typesMessage.evaluate
      this.reply = this.newType & typesMessage.reply
      this.text = this.newType & typesMessage.text

      this.returnSuccess = this.returnErreur = false
    },

    getAdminMessage() {
      this.newType = this.evaluate + this.reply + this.report + this.text + typesMessage.resume

      if( this.$refs.title.editor.isDirty() ) {
        this.newText.title = this.$refs.title.editor.getContent()
      } else {
        delete this.newText.title
      }
      if( this.$refs.adminText.editor.isDirty() ) {
        this.newText.adminText = this.$refs.adminText.editor.getContent()
      } else {
        delete this.newText.adminText
      }
      if( this.$refs.resume.editor.isDirty()) {
        this.newText.resume = this.$refs.resume.editor.getContent()
      } else {
        delete this.newText.resume
      }
      if(  this.$refs.text.editor.isDirty()) {
        this.newText.text = this.$refs.text.editor.getContent()
      } else {
        delete this.newText.text
      }

      const newMessage = {}
      if( Object.keys(this.newText).length)  {
        newMessage.text = this.newText
      }
      if( this.message) {
        if(this.newType != this.message.type) {
          newMessage.type = this.newType
        }
      } else {
        newMessage.type = this.newType
      }
      return newMessage
    },

    getNotAdminMessage() {
      delete this.newText.adminText
      const tmp = ( this.message && this.message.text) || cleanText
      if( tmp.title === this.newText.title) {
        delete this.newText.title
      }
      if( tmp.resume === this.newText.resume) {
        delete this.newText.resume
      }
      if(  this.$refs.text.editor.isDirty()) {
        this.newText.text = this.$refs.text.editor.getContent()
      } else {
        delete this.newText.text
      }

      const newMessage = {}
      if( Object.keys(this.newText).length) {
        newMessage.text = this.newText
      }
      return newMessage
    },

    async register() {
//       console.log("register")
      this.report = this.evaluate? typesMessage.report: 0
      const newMessage = this.isAdmin ? this.getAdminMessage() : this.getNotAdminMessage()
      if( Object.keys(newMessage).length) {
        if( this.message) {
          this.result = await libMessage.updateMessage( this.message, newMessage)
        } else {
          newMessage.parentId = 
          this.result = await libMessage.createMessage( this.parentId, newMessage )
        }
        this.result && this.callBack( this.result)
        this.returnErreur  = !this.result
        this.returnSuccess = !this.returnErreur
      }
      else{
        console.log( "no change")
      }
    },

    quite() {
      this.$bvModal.hide( 'WriteMessage')
    }
  },
  
}

</script>

<style scoped>
.text {
width: 100%;
}
</style>