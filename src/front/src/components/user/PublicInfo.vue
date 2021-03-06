<template>
  <div v-if="user" :style="{margin: '2em'}">
    <div class="grid">
      <div class="avatar">
        {{user.pseudo}}
        <p/>
        <b-img :src="avatarURL" width="128" height="128" />
      </div>
      <div class="eval">
        messages postés : {{user.nbResponse}}
        <p/>
        Interêt des messages :
        <p/>
        <div width="50%">
          <BarEval :obj="user" :interest="true" :agree="false"/>
        </div>
      </div>
      <div class="signal">
        Signalements reçus : {{user.nbReport}}
        <div v-for="(item, key) in reportChoice" 
          :variant="item.variant"
          :key="key" :id="key"
          :style="{color: item.color}">
          <div v-if="item.value">
            <div class="tabReport" >
              <div>{{item.text}} :</div>
              <div>{{user.report[key] || 0}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-html="user.presentation" class="presentation">
    </div>
  </div>
</template>

<script>
import BarEval from "@/components/BarEval.vue"
import {reportChoice} from "@/config/evaluat.js"

export default {
  name: "PublicInfo",
  props: {
    user: Object,
  },
  components:{
    BarEval,
  },
  data: function () {
    return {
      reportChoice,
    };
  },
  computed: {
    avatarURL() {
      return "Avatar/" + this.user.avatar
    },
  },
  methods: {
  },
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 4fr);
  grid-gap: 25px;  
}

.presentation {
  margin-top: '2em';
} 
.tabReport {
  display: grid; 
  grid-template-columns: 100px 40px ;
}
</style>
