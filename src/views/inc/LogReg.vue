 <template>
  <v-app-bar style="background: transparent" app color="#FFF" flat>
    <v-container class="py-0 justify-center fill-height">
      <router-link :to="{ name: 'Login' }">
        <v-img
          class="my-8"
          max-height="66"
          max-width="130"
          src="https://cdn3.mindmeister.com/assets/meisterlabs/products/meistertask/logo-2e5bf2d2ea0bbff1e48fb17e18f82676c0148771f0c51ab8ac380dacea2d5d1d.svg"
        >
        </v-img>
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