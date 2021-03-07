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
          modifier mes données privées
        </b-button>
      </div>
      <div>
        <b-button variant="outline-primary" @click="changePresentation = true">
          modifier ma présentation
        </b-button>
      </div>
    </div>
    <div v-if="changeAvatar">
      <b-form-file
        v-model="AvatarFile"
        :state="Boolean(AvatarFile)"
        placeholder="selectionnez un fichier ou glissez le ici"
        drop-placeholder="copiez le ici"
        accept="image/jpeg, image/png"
        @input="loadAvatar"
      ></b-form-file>
      <canvas ref="preview" height="128" width="128"></canvas>
      <b-button :disabled="!AvatarFile" @click="saveAvatar"> valider </b-button>
      <b-button @click="changeAvatar = false"> annuler </b-button>
    </div>
    <div v-if="changePresentation">
      <div class="my-toolbar" />
      <TinyEditor
        @onChange="changedPresentation = true"
        v-model="userInfo.presentation"
        :value="userInfo.presentation"
        placeholder="votre presentation"
        ref="presentation"
      />
      <b-button :disabled="!changedPresentation" @click="saveText">
        enregister
      </b-button>
      <b-button @click="changePresentation = false"> annuler </b-button>
    </div>
  </div>
</template>

<script>
import TinyEditor from "@/components/TinyEditor.vue";

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
      changePresentation: false,
      AvatarFile: null,
      changedPresentation: false,
    };
  },
  computed: {
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
      this.$store.commit("setMainPage", {
        component: "Register",
        props: { user: this.userInfo },
      });
    },
    async saveText() {
      this.userInfo.presentation = this.$refs.presentation.editor.getContent();
      const newUser = await this.$store.dispatch("updateUser", this.userInfo);
      if (newUser) {
        this.$emit("changedUser", newUser);
        this.changePresentation = false;
      }
    },

    loadAvatar(AvatarFile) {
      if (!this.img) {
        this.img = new Image();
        this.ctx = this.$refs.preview.getContext("2d");
      }
      createImageBitmap(AvatarFile).then((img) => {
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

    saveAvatar() {
      this.$refs.preview.toBlob(async (blob) => {
        var formData = new FormData();
        formData.append("avatar", blob);

        // in dev mod only, vscode reload the application
        // due to back write a file in public/Avatar
        const newUser = await this.$store.dispatch("newAvatar", formData);
        if (newUser) {
          this.$emit("changedUser", newUser);
          this.changeAvatar = false;
        }
      }, "image/jpeg");
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

b-button {
  margin: "1em";
}
</style>