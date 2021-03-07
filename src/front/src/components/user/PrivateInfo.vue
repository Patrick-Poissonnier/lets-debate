<template>
  <div v-if="userInfo" :style="{ margin: '2em' }">
    <div class="grid">
      <div class="avatar">
        {{ userInfo.pseudo }}
        <p />
        <b-img :src="avatarURL" width="128" height="128" />
        <p />
      </div>
      <div class="eval">
        <b> données privées :</b>
        <p />
        adresse mail : {{ userInfo.private.email || "non renseignée" }}
        <p />
        password : {{ "".padStart(userInfo.private.passwordLength, "*") }}
      </div>
      <div class="signal">
        <b>Fiabilité de vos signalements</b>
        <p />
        (TODO)
      </div>

      <div>
        <b-button variant="outline-primary" @click="changeAvatar = true">
          Changer d'avatar
        </b-button>
      </div>
      <div>
        <b-button variant="outline-primary" @click="updateRegisterData">
          modifier ma presentation
        </b-button>
      </div>
    </div>
    <div v-if="changeAvatar">
      <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="selectionnez un fichier ou glissez le ici"
        drop-placeholder="copiez le ici"
        accept="image/jpeg, image/png"
        @input="loadAvatar"
      ></b-form-file>
      <canvas ref="preview" height="128" width="128"></canvas>
      <b-button v-if="file" @click="saveAvatar"> valider </b-button>
    </div>
    <div class="my-toolbar" />
    <TinyEditor
      @onChange="changed = true"
      v-model="userInfo.presentation"
      :value="userInfo.presentation"
      placeholder="votre presentation"
      ref="presentation"
    />
    <b-button :disabled="!changed" @click="saveText"> enregister </b-button>
  </div>
</template>

<script>
//import Message from "@/components/messages/Message.vue"
import TinyEditor from "@/components/TinyEditor.vue";
//import axios from "@/DAL/myAxios";
//import libUser from "@/DAL/libUser";

export default {
  name: "PrivateInfo",
  props: {
    user: Object,
  },
  components: {
    TinyEditor,
    //    Message,
  },
  data: function () {
    return {
      userInfo: Object.assign({}, this.user),
      changeAvatar: false,
      file: null,
      changed: false,
    };
  },
  computed: {
    /*     userInfo() {
      return this.user
    }, */
    avatarURL() {
      return "Avatar/" + this.userInfo.avatar;
    },
  },
  created: function () {
    if (!this.userInfo.presentation) {
      this.userInfo.presentation = "";
    }
  },
  methods: {
    updateRegisterData() {
      this.changeAvatar = false;
      this.$store.commit("setMainPage", {
        component: "Register",
        props: { user: this.userInfo },
      });
    },
    saveText() {
      //      console.log('saveText : ' +this.$refs.presentation.editor.isDirty())
      this.userInfo.presentation = this.$refs.presentation.editor.getContent();

      axios
        .post("/user/update/", { presentation: this.userInfo.presentation })
        .then((response) => {
          if (typeof response.data === "object") {
            this.changeAvatar = false;
            this.$emit("updateUser", response.data);
          } else {
            console.log(response);
          }
        })
        .catch((erreur) => {
          console.log(erreur);
        });
    },

    loadAvatar(file) {
      if (!this.img) {
        this.img = new Image();
        this.ctx = this.$refs.preview.getContext("2d");
      }
      createImageBitmap(file).then((img) => {
        this.img = img;
        this.refreshCanvas();
      });
    },

    refreshCanvas() {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0)";
      this.ctx.fillRect(0, 0, 128, 128);
      const scale = Math.min(128 / this.img.height, 128 / this.img.width);
      this.ctx.translate(
        (128 - this.img.width * scale) / 2,
        (128 - this.img.height * scale) / 2
      );
      this.ctx.scale(scale, scale);
      this.ctx.drawImage(this.img, 0, 0);
    },

    async saveAvatar() {
      this.$refs.preview.toBlob((blob) => {
        var formData = new FormData();
        formData.append("avatar", blob);
        this.$store.dispatch("newAvatar", formData);
      }, "image/jpeg");
      alert("save");
    },
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 4fr);
  grid-gap: 10px;
}

.presentation {
  text-align: left;
  padding-top: "2em";
}
</style>