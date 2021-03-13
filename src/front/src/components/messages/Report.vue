<template>
  <div v-if="message.nbReport">
    <span :id="message.id + 'popover-report'">
      <b-img src="/logo/signe-attention.png" width="32" />
    </span>
    <b-popover
      :target="message.id + 'popover-report'"
      triggers="hover"
      placement="bottom"
    >
      <template #title>Signalements :</template>
      <b>
        <div
          v-for="(item, key) in reportChoice"
          :variant="item.variant"
          :key="key"
          :id="key"
          :style="{ color: item.color }"
        >
          <div v-if="item.value" class="tabReport">
            <div>{{ item.text }} :</div>
            <div>{{ message.report[key] || 0 }}</div>
          </div>
        </div>
      </b>
    </b-popover>
  </div>
</template>

<script>
import { reportChoice } from "@/config/evaluat.js";

export default {
  name: "Report",
  props: ["message"],
  data() {
    return {
      reportChoice: reportChoice,
    };
  },
};
</script>

<style scoped>
.tabReport {
  display: grid;
  grid-template-columns: 100px 40px;
}
</style>