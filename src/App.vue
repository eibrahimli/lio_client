<template>
  <v-app id="inspire">
    <div v-if="$route.name === 'Login'">
      <LogReg/>
    </div>
    <div v-if="$route.name !== 'Login'">
      <Sidebar></Sidebar>
    </div>
    <!-- Sizes your content based upon application components -->
    <v-main >
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view :key="$route.fullPath"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import LogReg from './views/inc/LogReg'
import Sidebar from "./views/Sidebar";

export default {
  data: () => ({

  }),

  components: {
    Sidebar,
    LogReg,
  },


};
</script>

<style>
a {
  text-decoration: none;
}
body {
  height: 100vh;
  width: 100vw;
}
#inspire{
  background: url("../public/bg2.jpg") no-repeat center center fixed !important;
  background-size: cover;
  height: 100vh;
}
</style>