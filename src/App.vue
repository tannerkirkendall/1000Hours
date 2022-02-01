<template>
  <div id="app">
      <ui-top-app-bar
        content-selector="#content-main"
        :type="type"
        :title="title"
        @nav="openDrawer = true"
      >

      </ui-top-app-bar>

      <ui-drawer v-if="currentUser" v-model="openDrawer" type="modal">
        <ui-drawer-header>
          <ui-drawer-title>Welcome {{ currentUser.firstName }}</ui-drawer-title>
        </ui-drawer-header>
        <ui-drawer-content>
          <ui-list-divider></ui-list-divider>
          <ui-list>
            <ui-nav-item href="/">
                <font-awesome-icon icon="running"/> &nbsp; Activities
            </ui-nav-item>
            <ui-nav-item href="/">
                <font-awesome-icon icon="trophy"/> &nbsp; Stats
            </ui-nav-item>
            <ui-nav-item href="/profile">
                <font-awesome-icon icon="user"/> &nbsp; Profile
            </ui-nav-item>
            <ui-list-divider></ui-list-divider>
            <ui-nav-item href="/" @click.prevent="logOut">
                <font-awesome-icon icon="sign-out-alt"/> &nbsp; Logout
            </ui-nav-item>
          </ui-list>
        </ui-drawer-content>
      </ui-drawer>

      <ui-drawer v-if="!currentUser" v-model="openDrawer" type="modal">
        <ui-drawer-header>
          <ui-drawer-title>Welcome Guest</ui-drawer-title>
        </ui-drawer-header>
        <ui-drawer-content>
          <ui-list-divider></ui-list-divider>
          <ui-list>
            <ui-nav-item href="/login">
                <font-awesome-icon icon="sign-in-alt"/> &nbsp; Login
            </ui-nav-item>
          </ui-list>
        </ui-drawer-content>
      </ui-drawer>

    <!-- <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href="/" class="navbar-brand">Hours Outside</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" /> Home
          </router-link>
        </li>

      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">

        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav> -->

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 0,
      title: 'Hours Outside',
      openDrawer: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style>
#app{
  background-color:rgb(245, 245, 245);
}
</style>