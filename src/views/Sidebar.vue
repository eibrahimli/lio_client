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
      >
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <v-toolbar-title class="white--text"><router-link :to="{name: 'dashboard'}" class="white--text">Lio Task Manager</router-link></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                dense
                v-bind="attrs"
                v-on="on"
            >
              <span class="mr-2">{{ currentProject.name ? currentProject.name :  currentProject }}</span>
              <v-icon small>mdi-arrow-down-drop-circle-outline</v-icon>
            </v-btn>
          </template>
          <v-list v-if="department !== null">
            <v-list-item
                v-show="!isLoading"
                v-for="(item, index) in department.projects"
                :key="index"
                :to="{ name: 'project', params: {id: item.id} }"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-app-bar>

      <v-navigation-drawer
          app
          v-model="drawer"
          @click="drawer = !drawer"
          dark
          style="background: black !important; opacity: .6"
      >
        <v-list
            nav
            dense
        >
          <v-list-item-group
              v-model="group"
              active-class="deep-purple--text text--accent-4"
          >
            <v-list-item :to="{name: 'dashboard'}" >
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <router-link class="white--text font-weight-black" style="color: white !important;" :to="{name: 'dashboard'}">Anasəhifə</router-link>
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click.prevent="logOut">
              <v-list-item-icon>
                <v-icon>mdi-account-minus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Çıxış Et
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
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
export default {
  name: "Sidebar",
  data() {
    return {
      drawer: false,
      group: null,
      isLoading: false,
      fullPage: true,
    }
  },

  components: {
    Loading
  },
  methods: {
    ...mapActions({'signOut': 'auth/signOut'}),
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
    ...mapGetters({'department' : 'auth/department','authenticated': 'auth/authenticated'}),
    currentProject() {
      let data = []
      if(this.$route.params.id && this.department) {
        console.log(this.$route.query)
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