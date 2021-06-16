<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        max-width="530px"
    >
      <template v-slot:activator="{on,attrs}">
        <div v-on="on" v-bind="attrs" style="width: 90%">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Yeni Proyekt</v-list-item-title>
          </v-list-item>
        </div>
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
                    autofocus
                    :error-messages="nameErrors"
                    label="Proyekt Adı"
                    v-model.trim="name"
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
                    @keyup.enter="submit"
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
              @click="submit"
          >
            Əlavə Et
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-snackbar
          :timeout="2000"
          absolute
          color="success"
          elevation="24"
          top
      >{{ text }}</v-snackbar>
    </v-dialog>
  </v-row>

</template>

<script>
import {validationMixin} from "vuelidate";
import {minLength, required} from "vuelidate/lib/validators";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Create",
  props: ['type'],
  data: () => ({
    dialog: false,
    name: '',
    text: ''
  }),
  validations: {
    name: {required, minLength: minLength(3)}
  },
  mixins: [validationMixin],
  computed: {
    ...mapGetters({'deparment' : 'auth/department'}),
    nameErrors() {
      const errors = []
      if(!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Proyekt adını daxil etmək vacibdir')
      !this.$v.name.minLength && errors.push(`Proyekt adı minimum ${this.$v.name.$params.minLength.min} simvol olmalıdır`)

      return errors
    }
  },
  methods: {
    ...mapActions(["storeProject"]),
    submit() {
      this.$v.$touch()

      if(!this.$v.$invalid) {
        let posted_data = { name: this.name, department_id: this.deparment.id}

        this.storeProject(posted_data).then(data => {
          this.$emit('new_project',data)
          this.dialog = false
          this.name = ''
          this.$v.$reset()
        })
      }
    }
  },

  mounted() {
    this.$v.$reset()

  }

}
</script>

<style scoped>

</style>