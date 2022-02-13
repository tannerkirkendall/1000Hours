<template>
  <div class="container">
    <h4>Hours Per Day</h4>
    <MonthlyChart v-bind:chartData="htw.data" v-bind:chartOptions="htw.options" class="charts"  />
    <br>
    <h4>Hours Per Month</h4>
    <MonthlyChart v-bind:chartData="hpm.data" v-bind:chartOptions="hpm.options" class="charts"  />
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
      chartOptions: {


        }
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    ...mapGetters('activity', {
      htw: 'hoursPerDayThisWeek' ,
      hpm: 'hoursPerMonth'
    })

  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }else {
      this.$store.dispatch("activity/init");

    }
  }

};

</script>
<style scoped>
  .container{
    padding-top: 70px;
    padding-bottom: 100px;

  }
  .charts{
    padding-right: 00px;
  }
</style>