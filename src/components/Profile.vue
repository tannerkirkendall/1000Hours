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
        <ui-button @click="setStartTimeNow()" icon="av_timer">Now</ui-button>
        <br>
        <br>
        <h5>End Time:</h5>

        <ui-datepicker
          v-model="editEndTime"
          :config="config"
          placeholder="Select Datetime.."
        >
        </ui-datepicker>
        <ui-button @click="setEndTimeNow()" icon="av_timer">Now</ui-button>

      </ui-dialog-content>
      <ui-dialog-actions>
        <ui-button @click="closeTimeDialog()">OK</ui-button>
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
    
    <ui-fab v-show="showStopLatest" class="circle-div-rec">
      <template #default="{ iconClass }">
        <ui-icon :class="iconClass">stop</ui-icon>
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
      openEditFrom: '',
      editStartTime: Date.now(),
      editEndTime: '',
      editId: '',
      data: this.activities,
      config: {
        enableTime: true,
        dateFormat: 'm/d/Y h:i K'
      },
      thead: [
        // {
        //   value: 'StartTime',
        //   sort: 'desc',
        //   columnId: 'startTime'
        // },
        'Start Time',
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
    newTime(){
      this.openEditFrom = 'new';
      this.editStartTime = format(Date.now(), "MM/dd/yyyy' 'h:mm a");
      this.editEndTime = '';
      this.openEdit = true;
    },

    editTime(data){
      this.openEditFrom = 'edit';
      this.editId = data._id;
      this.editStartTime = data.startTime;
      this.editEndTime = data.endTime;
      this.openEdit = true;
    },

    closeTimeDialog(){
      var d = {
        startTime: new Date(this.editStartTime),
        endTime: this.editEndTime == '' ? null : new Date(this.editEndTime)
      };
      
      if (this.openEditFrom == 'new'){
        this.postNewActivity(d);
      } 
      else if (this.openEditFrom == 'edit'){
        this.postEditActivity(d, this.editId);
      }

      this.editStartTime = '';
      this.editEndTime = '';
      this.openEditFrom = '';
      this.editId = '';
      this.openEdit = false;
    },

    postNewActivity(d) {
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

    postEditActivity(d, id){
      var patch = {
        data: d,
        id: id
      };
      this.$store.dispatch("activity/patchActivity", patch).then(
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

    setStartTimeNow(){
      this.editStartTime = format(Date.now(), "MM/dd/yyyy' 'h:mm a");
    },

    setEndTimeNow(){
      this.editEndTime = format(Date.now(), "MM/dd/yyyy' 'h:mm a");
    }

  },
  
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    ...mapGetters('activity', {
      activities: 'all',
      totals: 'totalMinutes' 
    }),
    showStopLatest(){
      var last = this.activities[0];
      return last?.endTime == '' ? true : false;
      // console.log("stop", last);
      // return false;
    }
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