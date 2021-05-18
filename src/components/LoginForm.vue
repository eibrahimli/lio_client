<template>
  <div>
    <loading :active.sync="isLoading"
             :can-cancel="false"
             :is-full-page="fullPage"
             color="#00AAFF"></loading>
    <v-row class="justify-center align-content-center" style="height: 80vh">
      <v-col lg="4" md="6" xl="3" sm="12">
        <v-card class="pa-6">

          <v-sheet class="text-center">
            <h2>Giriş</h2>
          </v-sheet>
          <div v-if="error !== null">
            <v-alert
                type="error"
                class="ma-3 pa-3"
                @close="toggle()"
                dismissible
                @input="error = null"
            >{{ error }}</v-alert>
          </div>
          <form>
            <v-text-field
                v-model="login"
                :error-messages="loginErrors"
                label="İstifadəçi adı"
                required
                @input="$v.login.$touch()"
                @blur="$v.login.$touch()"
            ></v-text-field>

              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"                
                :type="show1 ? 'text' : 'password'"
                :error-messages="passwordErrors"
                required
                name="input-10-1"
                label="Şifrə"
                hint="Ən azı 8 simvol"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
                @click:append="show1 = !show1"
              ></v-text-field>
          
            <v-checkbox
                v-model="checkbox"
                label="Məni Xatırla"
            ></v-checkbox>

            
            <v-btn
              block
              color="primary"
              rounded
              elevation="2"
              large
              @click="submit"
            >
              Gİrİş Et
            </v-btn>
                  
          </form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength} from 'vuelidate/lib/validators'
import {mapActions} from 'vuex'

// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  mixins: [validationMixin],

  validations: {
    login: {required},
    password: {required, minLength: minLength(8)},
  },

  components: {
    Loading
  },

  data: () => ({
    login: '',
    password: '',
    show1: false,
    checkbox: false,
    isLoading: false,
    fullPage: true,
    error: null
  }),

  computed: {

    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Şifrəni daxil etmək vacibdir')
      !this.$v.password.minLength && errors.push('Şifrə ən azı 8 simvol olmalıdır')
      return errors
    },

    loginErrors() {
      const errors = []
      if (!this.$v.login.$dirty) return errors
      !this.$v.login.required && errors.push('İstifadəçi adını daxil etmək vacibdir')
      return errors
    },
  },

  methods: {
    ...mapActions({'getToken': 'auth/getToken'}),
    submit() {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        this.isLoading = true
        this.getToken({
          login: this.login,
          password: this.password,
          checkbox: this.checkbox
        }).then( () => {
          setTimeout(() => {
            this.isLoading = false
            this.$router.replace({
              name: 'dashboard'
            })
          }, 1000)
        }).catch( () => {

          setTimeout(() => {
            this.isLoading = false
            this.error = 'İstifadəçi adı və ya şifrə yanlışdır.'
          }, 1000)
        })
      }
    },
  },
}
</script>

<style scoped>

</style>