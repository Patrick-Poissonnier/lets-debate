<template>
  <div class="bar_eval">
    <div
      v-if="showInterest"
      class="bar"
      :style="{ backgroundImage: backgroundstringInterest, height: '10px' }"
      v-b-popover.hover.bottom="
        `Interêt : ${obj.nbVote - obj.interest[1]} / ${obj.nbVote}`
      "
    ></div>

    <div v-if="showInterest && showAgree" class="spacer"></div>

    <div
      v-if="showAgree"
      class="bar"
      :style="{ backgroundImage: backgroundStringAgree, height: '10px' }"
      v-b-popover.hover.bottom="
        `approbation : ${obj.interest[4]} / ${
          obj.interest[3] + obj.interest[4]
        }`
      "
    >
      <p />
    </div>
  </div>
</template>

<script>
import { evaluatChoice, signalColor, interestColor } from "@/config/evaluat.js";

export default {
  name: "BarEval",
  props: ["obj", "interest", "agree"], // user or message, boolean, boolean

  methods: {
    firstLimite(pctReport, min, max) {
      // For 20 / 80 statistiques
      return (
        pctReport +
        Math.max(0, ((min - (max - min) / 3) * (100 - pctReport)) / 100)
      );
    },
    secondLimite(pctReport, min, max) {
      return (
        pctReport +
        Math.min(100, ((max + (max - min) / 3) * (100 - pctReport)) / 100)
      );
    },
  },

  computed: {
    showInterest() {
      return this.interest && typeof this.obj.minInterest === "number";
    },
    showAgree() {
      return this.agree && typeof this.obj.minAgree === "number";
    },

    pctInterest() {
      return Math.round((this.obj.minInterest + this.obj.maxInterest) * 50);
    },
    pctAgree() {
      if (this.obj.minAgree) {
        return Math.round((this.obj.minAgree + this.obj.maxAgree) * 50);
      } else return null;
    },

    backgroundstringInterest() {
      const pctReport =
        Math.min(100, Math.max(0, this.obj.nbReport / this.obj.nbVote)) * 100;
      const result = `linear-gradient( 90deg,
        ${signalColor},
        ${signalColor} ${pctReport}%,
        ${evaluatChoice[1].color} ${pctReport}%,
        ${evaluatChoice[1].color} ${this.firstLimite(
        pctReport,
        100 - this.obj.maxInterest,
        100 - this.obj.minInterest
      )}%,
        ${interestColor} ${this.secondLimite(
        pctReport,
        100 - this.obj.maxInterest,
        100 - this.obj.minInterest
      )}%,
        ${interestColor} 
      )`;
      //      console.log( result)
      return result;
    },
    backgroundStringAgree() {
      return `linear-gradient( 90deg,
        ${evaluatChoice[4].color},
        ${evaluatChoice[4].color} ${this.firstLimite(
        0,
        this.obj.minAgree,
        this.obj.maxAgree
      )}%,
        ${evaluatChoice[3].color} ${this.secondLimite(
        0,
        this.obj.minAgree,
        this.obj.maxAgree
      )}%,
        ${evaluatChoice[3].color} 
      )`;
    },
  },
};
</script>
<style scoped>
.bar_eval {
  margin-top: 0.5em;
  line-height: 0.25em;
}
.text {
  text-align: center;
}
.spacer {
  line-height: 1em;
}
</style>