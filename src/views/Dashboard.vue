<template>
  <div>
    <v-row>
      <v-col>
        <v-card
            class="mx-auto"
            max-width="80%"
            tile
        >
          <h1 class="display-2 pa-10 text-center font-weight-bold">Welcome Lio Task Manager App</h1>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {

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