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


    <ui-dialog v-model="openEdit" fullscreen>
      <ui-dialog-title>Edit Activity</ui-dialog-title>
      <ui-dialog-content>
        <h5>Start Time:</h5>
        <ui-datepicker
          v-model="editStartTime"
          :config="config"
          placeholder="Select Datetime.."
        >
        </ui-datepicker>
        <br>
        <br>
        <h5>End Time:</h5>

        <ui-datepicker
          v-model="editEndTime"
          :config="config"
          placeholder="Select Datetime.."
        >
        </ui-datepicker>

      </ui-dialog-content>
      <ui-dialog-actions>
        <ui-button @click="closeEditTime(postData)">OK</ui-button>
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
        <ui-icon @click="editTime(data)">edit</ui-icon>
      </template>
    </ui-table>
    
    <ui-fab class="circle-div-rec">
      <template #default="{ iconClass }">
        <ui-icon :class="iconClass">pause</ui-icon>
      </template>
    </ui-fab>

    <ui-fab class="circle-div-add">
      <template #default="{ iconClass }">
        <ui-icon :class="iconClass" @click="newTime()">add</ui-icon>
      </template>
    </ui-fab>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'

export default {
  name: 'Profile',
  data() {
    return {
      openEdit: false,
      editStartTime: Date.now(),
      editEndTime: '',
      data: this.activities,
      config: {
        enableTime: true,
        dateFormat: 'm/d/Y h:i K'
      },
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
    editTime(data){
      console.log(data);
      this.editStartTime = data.startTime;
      this.editEndTime = data.endTime;
      this.openEdit = true;
    },

    closeEditTime(data){
      console.log("close", data);
      var d = {
        startTime: new Date(this.editStartTime)
      };
      console.log("payload", d);
      this.postNewActivity(d);
      this.editStartTime = '';
      this.editEndTime = '';
      this.openEdit = false;
    },

    newTime(){
      this.editStartTime = format(Date.now(), "MM/dd/yyyy' 'h:mm a");
      this.editEndTime = '';
      this.openEdit = true;
    },
    
    postNewActivity(d) {
      console.log("1")
      this.$store.dispatch("activity/postActivity", d).then(
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },

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
.circle-div-add {
    /* background-color: #314963; */

    position: fixed;
    bottom: 21px;
    right: 25px;
}

.circle-div-rec {
    background-color: #ad000e;

    position: fixed;
    bottom: 21px;
    right: 100px;
}
</style>