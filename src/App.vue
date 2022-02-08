<template>
  <div id="app">
      <ui-top-app-bar
        content-selector="#content-main"
        :type="type"
        :title="title"
        @nav="openDrawer = true"
        :fixed=true
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
            <ui-nav-item href="/stats">
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

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 2,
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