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


<ui-dialog v-model="open" fullscreen>
  <ui-dialog-title>Full-Screen Dialog Title</ui-dialog-title>
  <ui-dialog-content>
    {{popupData}}
    <ui-datepicker
      v-model="date"
      :config="config"
      placeholder="Select Datetime.."
      toggle
      clear
    >
      <template #toggle>
        <i class="fa fa-calendar"></i>
      </template>
      <template #clear>
        <i class="fa fa-close"></i>
      </template>
    </ui-datepicker>
    
  </ui-dialog-content>
  <ui-dialog-actions>
    <ui-button @click="open = false">OK</ui-button>
  </ui-dialog-actions>
</ui-dialog>

<ui-table
  :data="activities"
  showProgress
  fullwidth
  :thead="thead"
  :tbody="tbody"
  :scroll="{ y: 300 }"
  selected-key="_id"
>
  <template #dessert="{ data }">
    <div class="dessert">{{ data }}</div>
  </template>
  <template #actions="{ data }">
    <ui-icon @click="show(data)">edit</ui-icon>
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
      open: false,
      data: this.activities,
      popupData: '',
      config: {
        enableTime: true,
        dateFormat: 'm/d/Y h:i K'
      },
      date: '',
      thead: [
        'StartTime',
        'HH:MM',
        'Actions',
      ],
      tbody: [
        {
          field: 'startTime',
          class: data => {
            return data.totalElapsedMinutes == null ? 'red' : 'blue';
        }
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
      this.popupData = data;
      this.date = data.startTime;
      this.open = true;
    }
  },
  
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    ...mapGetters('activity', {
      activities: 'all',
      totals: 'totalMinutes' 
    })
  },
  mounted() {
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