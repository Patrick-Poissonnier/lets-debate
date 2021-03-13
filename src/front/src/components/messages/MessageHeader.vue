<template>
  <div>
    <span class="left">
      <a
        :href="uri('UserInfo', { pseudo: message.authorPseudo })"
        @click.prevent="$emit('goUserInfo', message.authorPseudo)"
      >
        {{ message.authorPseudo }}
      </a>
      :&nbsp;
    </span>
    <a
      :href="uri('Debate', { id: message.id })"
      class="titleText"
      @click.prevent="$emit('titleClicked')"
    >
      {{ message.text.title }}
    </a>

    <span class="right">
      <b-dropdown variant="outline-primary" size="sm">
        <b-dropdown-item-button
          v-if="this.$store.getters.getConnectedUser.auth > 1"
          @click="$emit('actionWriteMessage', message)"
        >
          admin
        </b-dropdown-item-button>
      </b-dropdown>

      <b-button
        variant="outline-primary"
        class="btn"
        v-if="bText"
        style="text-align: 'right'"
        @click="changeShowText"
        size="sm"
      >
        -
      </b-button>
      <b-button
        variant="outline-primary"
        class="btn"
        v-else
        @click="changeShowText"
        size="sm"
        >+
      </b-button>
    </span>
  </div>
</template>

<script>
export default {
  name: "MessageHeader",
  props: ["message", "showText"],
  components: {},
  data() {
    return {
      bText: this.showText,
    };
  },

  methods: {
    changeShowText() {
      this.$emit("changeShowText", this.bText);
      this.bText = !this.bText;
    },
    uri(component, props) {
      return `http:${component}?${JSON.stringify(props)}`;
    },
  },
};
</script>

<style scoped>
.left {
  float: left;
  min-width: 90px;
  text-align: center;
}
.right {
  float: right;
  margin: 0 0.5em;
}
.titleText {
  font-weight: bold;
}
</style>