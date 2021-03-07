<template>
  <b-modal id="modal-logout" title="Se deconnecter" @ok="handleOk">
    vraiment ?
  </b-modal>
</template>

<script>
export default {
  name: "modal-logout",
  methods: {
    handleOk() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
