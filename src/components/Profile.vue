<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{currentUser.firstName}}'s</strong> Profile
      </h3>
    </header>
    <!-- <p>
      <strong>Token:</strong>
      {{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}
    </p>
    <p>
      <strong>Payload:</strong>
      {{activities}}
    </p>

    <strong>Activities:</strong>
    <ul>
      <li v-for="a in activities" :key="a">{{a._id}}, {{a.startTime}}, {{a.endTime}}, {{a.elapsedHours}}:{{a.elapsedMinutes}}</li>
    </ul>

    <strong>Total Time:</strong>
    <ul>
      {{totals}}
    </ul> -->

<ui-table
  :data="activities"
  fullwidth
  :thead="thead"
  :tbody="tbody"
  :scroll="{ y: 300 }"
  selected-key="_id"
>

  <template #dessert="{ data }">
    <div class="dessert">{{ data.dessert }}</div>
  </template>
  <template #actions="{ data }">
    <!-- <ui-icon @click="show(data)">description</ui-icon> -->
    <ui-icon @click="show(data)">edit</ui-icon>
    <!-- <ui-icon @click="show(data)">delete</ui-icon> -->
  </template>

</ui-table>



  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      data: this.activities,
      thead: [
        'StartTime',
        'HH:MM',
        'Actions',
      ],
      tbody: [
        {
          field: 'startTime'
        },
        {
          field: 'elapsedFormat'
        },
        {
          slot: 'actions'
        }
      ]
    };
  },

  methods:{
    show(data){
      console.log(data);
    }
  },
  
  computed: {
    currentUser() {
      console.log('before current user')
      return this.$store.state.auth.user;
    },
    ...mapGetters('activity', {
      activities: 'all',
      totals: 'totalMinutes' 
    })
  },
  mounted() {
    console.log('before mounted;')
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },
  created() {
    this.$store.dispatch("activity/init");
  }
};
</script>
<style scoped>

</style>