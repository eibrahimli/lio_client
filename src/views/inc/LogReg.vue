 <template>
  <v-app-bar style="background: transparent" app color="#FFF" flat>
    <v-container class="py-0 justify-center fill-height">
      <router-link :to="{ name: 'Login' }">
        <h1 class="font-weight-bold mt-14 display-2 ">Kob Lio Task Manager</h1>
      </router-link>
    </v-container>
  </v-app-bar>
</template>
 
 <script>
export default {
  data() {
    return {
      path: "login",
    };
  },
};
</script>
 
 <style>
</style>