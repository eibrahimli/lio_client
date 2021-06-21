<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-sheet height="64">
          <v-toolbar
              flat
          >
            <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
            >
              Today
            </v-btn>
            <v-btn
                fab
                text
                small
                color="grey darken-2"
                @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
                fab
                text
                small
                color="grey darken-2"
                @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="510">
          <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              type="category"
              category-show-all
              :categories="categories"
              :events="events"
              :event-color="getEventColor"
              @change="fetchEvents"
          ></v-calendar>
        </v-sheet>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6">
        <v-card
            max-width="100%"
            class="mx-auto"
        >
          <v-toolbar
              dark
          >
            <v-toolbar-title>Tapşırıqlarınız</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu
                bottom
                left
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>mdi-filter</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item :key="100" @click="filterAsiggnedTasks('created_at')" link>
                  <v-list-item-title>Yarandığı tarixə görə</v-list-item-title>
                </v-list-item>
                <v-list-item :key="200" @click="filterAsiggnedTasks('deadline')" link>
                  <v-list-item-title>Bitiş tarixinə görə</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>

          <v-virtual-scroll :items="items" :item-height="50" height="510px" three-line>
            <template v-slot:default="{item,index}">
              <v-subheader
                  v-if="item.header"
                  :key="item.header"
                  v-text="item.header"
              ></v-subheader>

              <v-divider v-if="!item.header" :key="index" :inset="true"></v-divider>

              <v-list-item class="pl-7" link v-if="!item.header" :key="item.name+index">
                <v-list-item-content>
                  <v-list-item-title class="title">{{index}}.{{item.name}}</v-list-item-title>
                  <v-list-item-subtitle><span class="text--primary">{{ item.text }}</span></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-col>

      <div class="greeting">
        <h1 class="white--text font-weight-bold">Hər vaxtınız xeyir, {{ user.name }}</h1>
        <span class="display-1 white--text font-weight-bold">{{ date }}</span>
        <p>“If you fight you might lose, if you don’t you have already lost.”</p>
        <div class="kr-text" style="font-size: 15px; font-weight: 500; line-height: 22px; letter-spacing: normal; margin-top: 10px; color: white;">Bertolt Brecht</div>
      </div>

<!--      <v-bottom-navigation dark app>-->
<!--        <p class="body-1 text-center mt-4">&copy; AG Developments Team | Elvir İbrahimli and Elvin Mammedov</p>-->
<!--      </v-bottom-navigation>-->
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
    type: 'create',
    focus: '',
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    categories: ['Elvir Ibrahimli', 'Elvin Mamedov'],
    items: [
      { header: 'Sizin tapşırıqlarınız' },
    ],
    date: '',
  }),
  methods: {
    ...mapActions({
      'getDepartment': 'auth/getDepartment',
      'removeProjectFromApi': 'removeProjectFromApi',
      'filter' : 'filterAssignedTasks'
    }),
    addProject(data) {
      this.projects.unshift(data)
      this.snackbar = true
      this.text = 'Proyekt uğurla təyin edildi'
    },
    async filterAsiggnedTasks(field) {
      let response = await this.filter(field)

      this.items = [{ header: 'Sizin tapşırıqlarınız' }]
      this.items.push(...response)
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
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    fetchEvents ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
          category: this.categories[this.rnd(0, this.categories.length - 1)],
        })
      }

      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

    fullDate() {
      let h = new Date().getHours()
      let m = new Date().getMinutes()

      if(h > 12 || h===12 && m > 0){
        if(m >=0 && m < 10) {
          m = '0'+m
        }
        this.date = new Date().getHours()+' : '+m+" : PM"
      } else{
        this.date = new Date().getHours()+' : '+m.getMinutes()+" : AM"
      }

      setTimeout(() => this.fullDate(), 1000)

    }
  },
  mounted() {
    this.getDepartment()
    this.$refs.calendar.checkChange()
    this.items.push(...this.user.assigned_tasks)
    this.fullDate()
  },
  created() {
    this.fullDate()
  }

}
</script>

<style scoped>
  .greeting {
    position: absolute;
    bottom: 2rem;
    left: 1rem;
  }
  .greeting p {
    font-size: 17px;
    font-weight: 400;
    line-height: 25px;
    letter-spacing: normal;
    color: white;
    margin-top: 20px;
    text-indent: -0.55em;
  }
</style>