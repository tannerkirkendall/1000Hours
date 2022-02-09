<template>
  <div class="container">
    <h4>Hours Per Day: This Week</h4>
    <MonthlyChart v-bind:chartData="htw" class="charts"  />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MonthlyChart from './MonthlyChart.vue'

export default {
  name: "Stats",
  components: {
    MonthlyChart
  },
  data() {
    return {
      content: "adsf",
      chartData:this.htw
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    ...mapGetters('activity', {
      htw: 'hoursPerDayThisWeek' 
    })
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }else {
      this.$store.dispatch("activity/init");
      mapGetters('activity', {
        htw: 'hoursPerDayThisWeek' 
    })
    }
  }

};
</script>
<style scoped>
  .container{
    padding-top: 70px;

  }
  .charts{
    padding-right: 00px;
  }
</style>