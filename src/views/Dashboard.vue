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
              <div class="mr-2"><Create></Create></div>
            </v-subheader>
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
    ...mapGetters({'projects' : 'auth/projects'}),
  },

  methods: {
    ...mapActions({'getDepartment' : 'auth/getDepartment'}),
  },
  mounted() {
    this.getDepartment()
  }

}
</script>

<style>

</style>