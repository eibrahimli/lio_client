<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        max-width="530px"
    >
      <template v-slot:activator="{on,attrs}">
        <v-btn rounded class="primary" v-on="on" v-bind="attrs" small><v-icon>mdi-plus</v-icon></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Yeni Proyekt Təyin Et</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
              >
                <v-text-field
                    label="Proyekt Adı"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="error"
              small
              @click="dialog=false"
          >
            Bağla
          </v-btn>
          <v-btn
              small
              color="primary"
              @click="dialog = false"
          >
            Əlavə Et
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

</template>

<script>
export default {
  name: "Create",
  data: () => ({
    dialog: false,
  }),
}
</script>

<style scoped>

</style>