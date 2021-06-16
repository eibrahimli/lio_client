<template>
  <div>
    <loading :active.sync="isLoading"
             :can-cancel="false"
             :is-full-page="fullPage"
             color="#00AAFF"></loading>
    <v-card
        class="mx-auto overflow-hidden"
    >
      <v-app-bar
          dark
          app
          class="transparent"
      >
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <v-toolbar-title class="white--text"><router-link :to="{name: 'dashboard'}" class="white--text">Lio</router-link></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-list rounded dense nav dark flat>
          <v-list-item class="rounded" @click.prevent="logOut">
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-account-minus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Çıxış Et
            </v-list-item-title>
          </v-list-item>
        </v-list>

      </v-app-bar>

      <v-navigation-drawer
          app
          dark
          mini-variant.sync
          v-model="drawer"
          style="background: black !important; opacity: .6"
      >
        <v-list
            nav
            dense
        >
          <v-list-item-group
              v-model="group"
              active-class="white--text text--accent-4"
          >
            <v-list-item :to="{name: 'dashboard'}" >
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <router-link class="white--text font-weight-black" :to="{name: 'dashboard'}">Anasəhifə</router-link>
              </v-list-item-title>
            </v-list-item>

          </v-list-item-group>
        </v-list>
        <v-list nav dense>
          <v-list-item-group v-model="group" active-class="white--text text--accent-4">
            <Create :type="type" v-on:new_project="addProject"></Create>
          </v-list-item-group>
        </v-list>
        <v-list class="mt-7">

          <v-list-group
              prepend-icon="mdi-group"
          >
            <template v-slot:activator>
              <v-list-item-title>Proyektlər</v-list-item-title>
            </template>

              <v-list-item active-class="white--text" :to="{ name: 'project', 'params' : {id: proj.id} }" link class="text-center" v-for="proj in projects" :key="proj.id">
                <v-list-item-title v-text="proj.name">
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
        </v-list>

      </v-navigation-drawer>

    </v-card>
  </div>
</template>

<script>


import {mapActions, mapGetters} from "vuex";
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
import Create from "@/components/projects/Create";
export default {
  name: "Sidebar",
  data() {
    return {
      drawer: false,
      group: null,
      isLoading: false,
      fullPage: true,
      type: 'create',
      snackbar: false,
      text: ''
    }
  },

  components: {
    Loading, Create
  },
  methods: {
    ...mapActions({'signOut': 'auth/signOut'}),
    addProject(data) {
      this.projects.unshift(data)
      this.snackbar = true
      this.text = 'Proyekt uğurla təyin edildi'
    },
    logOut() {
      try {
        this.isLoading = true
        let response = this.signOut()
        response.then(() => {
          setTimeout(() => {
            this.isLoading = false
            this.$router.replace({'name': 'Login'})
          },1000)
        })
      } catch (e) {
        console.log(e)
      }
    }
  },

  computed: {
    ...mapGetters({'department' : 'auth/department','authenticated': 'auth/authenticated','projects': 'auth/projects'}),

    currentProject() {
      let data = []
      if(this.$route.params.id && this.department) {
        data = this.department.projects.filter(project => project.id === this.$route.params.id)
      }

      return data.length > 0 ? data[0] : 'Bütün Proyektlər'
    }
  },

}
</script>

<style scoped>
  a{
    color: black !important;
  }
</style>