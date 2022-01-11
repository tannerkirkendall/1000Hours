<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>{{currentUser.firstName}}'s</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Token:</strong>
      {{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}
    </p>
    <p>
      <strong>Id:</strong>
      {{currentUser.userId}}
    </p>
    <p>
      <strong>Email:</strong>
      {{products}}
    </p>
    <strong>Authorities:</strong>
    <ul>
      <li v-for="a in act" :key="a">{{a._id}}, {{a.startTime}}, {{a.endTime}}</li>
    </ul>

    <strong>Authorities2:</strong>
    <ul>
      <li v-for="a in products" :key="a">{{a._id}}, {{a.stateDate}}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  computed: {
    currentUser() {
      console.log('before current user')
      return this.$store.state.auth.user;
    },
    act() {
      return this.$store.state.activity.activities;
    },
    ...mapGetters('activity', {
      products: 'all'
    })
  },
  mounted() {
    console.log('before mounted;')
    if (!this.currentUser) {
      this.$router.push('/login');
    }
    this.$store.dispatch("activity/getActivities");

  }
};
</script>