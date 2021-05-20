<template>
  <div>
    <v-row>
      <v-col>
        <v-card
            class="mx-auto"
            max-width="80%"
            tile
        >
          <v-list flat>
            <v-subheader class="font-weight-bold">Bütün Proyektlər
              <v-spacer></v-spacer>
              <div class="mr-2">
                <Create :type="type" :department_id="user.department_id" v-on:new_project="addProject"></Create>
              </div>
            </v-subheader>
            <v-snackbar
                :timeout="2000"
                v-model="snackbar"
                absolute
                color="success"
                elevation="24"
                top
            >
              {{ text }}
            </v-snackbar>
            <v-list-item-group
                color="primary"
            >
              <v-list-item
                  v-for="(project, i) in projects"
                  :key="i"
                  :to="{name: 'project', params: {id: project.id} }"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="project.name"></v-list-item-title>
                </v-list-item-content>
                <v-btn class="mr-2" right icon small @click.prevent="deleteProject(project.id)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Create from "../components/projects/Create";

export default {
  components: {Create},

  computed: {
    ...mapGetters({'projects': 'auth/projects', 'user': 'auth/user'}),
  },
  data: () => ({
    snackbar: false,
    text: '',
    type: 'create'
  }),
  methods: {
    ...mapActions({'getDepartment': 'auth/getDepartment', 'removeProjectFromApi': 'removeProjectFromApi'}),
    addProject(data) {
      this.projects.unshift(data)
      this.snackbar = true
      this.text = 'Proyekt uğurla təyin edildi'
    },
    deleteProject(id) {
      this.removeProjectFromApi(id).then(mes => {
        if (mes === 'success') {
          this.projects.map((pr, index) => {
            if (pr.id === id) {
              this.snackbar = true
              this.text = 'Proyekt uğurla silindi'
              this.$delete(this.projects, index)
            }
          })
        }
      }).catch(e => {
        console.log(e)
      })
    }
  },
  mounted() {
    this.getDepartment()
  }

}
</script>

<style>

</style>