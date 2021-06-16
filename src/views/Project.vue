<template>
  <div>
    <v-row>
          <v-col sm="6" xs="12" lg="3" cols="12" v-for="(status,index) in project.statuses" :key="status.id">
            <v-card>
              <v-card-title @mouseenter="currentStatus = status" @mouseleave="currentStatus = null" style="height: 6vh" class="align-content-center white--text" :style="generator()">
                <v-col cols="12" class="d-flex align-center justify-space-between flex-row">
                  <div @dblclick.stop.self="editStatus(status)" v-show="statuses_ids.includes(status.id)" class="headline">{{ status.name }}</div>
                  <div v-show="showEditStatus && !statuses_ids.includes(status.id)" class="col10">
                    <v-text-field
                        autofocus
                        v-model.trim="section_name"
                        solo
                        class="mt-8"
                        @blur.prevent="updateStatus(status)"
                        @keyup.enter="updateStatus(status)"
                    >

                    </v-text-field>
                  </div>
                  <v-spacer></v-spacer>
                  <v-col cols="3" class="d-inline-flex">
                    <v-menu @mouseenter="currentStatus = status" @mouseleave="currentStatus = null" offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            dark
                            v-bind="attrs"
                            icon
                            v-on="on"
                            v-show="currentStatus === status"
                        >
                          <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
                        </v-btn>
                      </template>
                      <v-list @mouseenter="currentStatus = status" @mouseleave="currentStatus = null">
                        <v-list-item @mouseenter="currentStatus = status" @mouseleave="currentStatus = null">
                          <v-list-item-title @click.prevent="deleteStatus(status,index)" class="pointer">Statusu Sil
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                    <div class="d-flex mt-1 da con align-center justify-center" style="height: 25px; width: 25px">
                      <div style="width: 100%;height: 100%"
                           class="d-flex align-center justify-center dark white--text rounded-circle text-center mt-1 text-body-1">
                        {{ status.tasks.length }}
                      </div>
                    </div>
                  </v-col>
                </v-col>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text class="mx-0 px-0 my-0 py-0">
                <v-col
                    cols="12"
                    class="mx-0 px-0 py-0 my-0"
                >
                  <drop-list class="dropListHeight" :items="status.tasks" @reorder="$event.apply(status.tasks)"
                             @insert="insert1(status.tasks,status.id,$event)" mode="cut">
                    <template v-slot:item="{item}">
                      <drag :key="item.id" :data="item" @cut="removeItem(status.tasks, item)">
                        <v-sheet class="pointer v-sheet--outlined mx-0 my-0">
                          <v-alert @click.prevent="getTaskDetails(item)" class="ma-0" v-if="item.completed" text dense type="success">Tapşırıq bitdi</v-alert>
                          <div @click.prevent="getTaskDetails(item)" class="px-4 py-3 black--text elevation-2 font-weight-medium subtitle-2">
                            <span class="d-block" :class="{'text-decoration-line-through': status.name == 'Done' || item.completed}">{{ item.name }}</span>
                            <div v-if="item.comments && item.comments.length > 0">
                              <v-icon small left>mdi-message-reply-text-outline</v-icon>
                              <span>{{ item.comments.length }}</span>
                            </div>
                          </div>
                        </v-sheet>
                      </drag>
                    </template>
                    <template v-slot:feedback="{ data }">
                      <v-sheet :key="data.name" class="pointer">
                        <div class="pa-2 black--text elevation-1 text-center">{{ data.name }}</div>
                      </v-sheet>
                    </template>
                    <v-sheet v-show="!showTextField && activeItem !== status" class="text-center mt-5">
                      <v-icon @click.prevent="clicked(status)" class="pointer">mdi-plus</v-icon>
                    </v-sheet>
                    <v-sheet v-if="showTextField && activeItem === status">
                      <v-text-field
                          v-model.trim="task_name"
                          solo
                          autofocus
                          @keydown.enter="addTask(status.tasks,status.id)"
                          @blur.self="addTask(status.tasks,status.id)"
                          clearable
                      ></v-text-field>
                    </v-sheet>
                    <v-col v-if="status.tasks.length === 0" class="d-flex flex-column">
                      <v-icon>mdi-check-outline</v-icon>
                      <span class="text-center">Tapşırıq yoxdur</span>
                    </v-col>
                  </drop-list>
                </v-col>

              </v-card-text>
            </v-card>
          </v-col>
          <v-col sm="6" xs="12" lg="3" cols="12">
            <v-card height="60.1vh">
              <v-card-title style="height: 6vh"
                            class="blue justify-start align-content-center darken-1 white--text text-left">
                <v-col cols="12">
                  <v-btn v-if="addSection" @click="addSection = false" style="text-transform: lowercase" text
                         class="justify-start text-body-1 white--text" block>
                    <v-icon>mdi-plus</v-icon>
                    yeni status
                  </v-btn>

                  <v-text-field
                      v-model.trim="section_name"
                      class="mt-8" v-if="!addSection" solo
                      @blur.prevent="addSectionToApi"
                      @keydown.enter.prevent="addSectionToApi"
                      autofocus
                  >
                  </v-text-field>
                </v-col>
              </v-card-title>
              <v-card-text>
                <v-col class="dropListHeight">

                </v-col>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
    <Comment :task="task" :is_completed='is_completed' v-if="dialog && task != null">
      <template v-slot:default="taskSlot">
        <v-row>
          <v-dialog
              v-model="dialog"
              max-width="700px"
              v-if="dialog"
          >
            <v-card>
              <v-card-title>
                <v-row>
                  <v-col cols="12">
                    <v-sheet height="80" width="100%" class="d-flex flex-row flex-shrink-1">
                      <v-flex shrink="1" grow="0" class="d-flex justify-space-around flex-row align-start">
                        <v-btn :disabled="taskSlot.task.completed === 1 ? 'disabled' : null" class="flex-shrink-1 mr-5" height="48" @click.prevent="taskSlot.task.completed = 1; taskUpdate(taskSlot.task)" color="primary"> Bİtİr</v-btn>
                        <v-spacer></v-spacer>
                        <v-select v-model.trim="assign" @change="assignTaskToEmployee" :items="department.employees" item-value="id" item-text="name" clearable class="flex-grow-0" solo
                                  label="Unasigned"></v-select>
                      </v-flex>
                      <v-flex class="d-flex flex-shrink-1 align-start justify-end">
                        <v-menu
                            bottom
                            left
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                            >
                              <v-icon class="text-end">mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item
                                @click.prevent="removeTask(taskSlot.task)"
                            >
                              <v-list-item-title>Tapşırığı Sil</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-flex>
                    </v-sheet>
                  </v-col>

                  <v-col v-show="taskSlot.task.completed === 1" cols="12">
                    <v-alert text type="success">Bu tapşırıq bitirildi</v-alert>
                  </v-col>

                </v-row>

              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-row>
                  <div class="col-8">
                    <v-col cols="12">
                      <v-card class="mt-3" width="100%">
                        <v-card-text class="pb-0">
                          <v-textarea
                              filled
                              auto-grow
                              v-model.trim="taskSlot.task.name"
                              @blur.prevent="taskUpdate(taskSlot.task)"
                              label="Task Adı"
                              rows="2"
                              row-height="4"
                          ></v-textarea>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-card block width="100%">
                        <v-card-text class="pb-0">
                          <v-textarea
                              filled
                              auto-grow
                              v-model.trim="taskSlot.task.text"
                              label="Task Notları"
                              @blur.prevent="taskUpdate(taskSlot.task)"
                              rows="2"
                              row-height="4"
                          ></v-textarea>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                          solo
                          v-model.trim="comment"
                          name="input-7-4"
                          label="Rəy əlavə et"
                      ></v-textarea>
                      <v-btn @click.prevent="addComment" color="primary">
                        Əlavə Et
                      </v-btn>
                    </v-col>

                    <v-col cols="12">
                      <h1>Rəylər</h1>
                      <v-list two-line>
                        <template v-for="item in taskSlot.task.comments">

                          <v-list-item
                              class="mb-0"
                              :key="item.id"
                          >
                            <v-list-item-content>
                              <v-list-item-title>{{ item.emp.name }} {{ item.created_by }}</v-list-item-title>
                              <p class="pa-2 rounded elevation-1 deep purple lighten-5 body-3">{{ item.text }}</p>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-col>
                  </div>
                  <div class="col-4 pl-0 ml-0 mr-0 pr-0">
                    <v-col cols="12" class="pl-0 pr-0">
                      <v-card class="mt-3 pl-0">
                        <v-menu bottom>
                          <template v-slot:activator="{on,attrs}">
                            <v-btn color="#ddd" v-bind="attrs" v-on="on" elevation="1" height="84" solo block tile
                                   class="text-capitalize">
                              <v-icon left>mdi-calendar-range</v-icon>
                              Tapşırıq bitiş vaxtı <br>
                              {{ taskSlot.task.deadline }}
                              <v-icon small right>mdi-arrow-down-drop-circle</v-icon>

                            </v-btn>

                          </template>

                          <v-date-picker @change="updateTask(taskSlot.task)" v-model.trim="taskSlot.task.deadline" flat></v-date-picker>
                        </v-menu>
                      </v-card>
                    </v-col>
                    <v-col cols="12" class="pl-0 pr-0">
                      <v-card color="#ddd" class="mt-3 pl-0">
                        <v-card-text>
                          <h2 class="subtitle-1"><v-icon class="mr-2" small>mdi-shape-square-rounded-plus</v-icon>Təyin olundu</h2>
                          <p class="body-2 ml-9" v-text="taskSlot.task.created_at !== null ? taskSlot.task.created_at.substring(0,10) : null"></p>

                          <h2 class="subtitle-1"><v-icon class="mr-2" small>mdi-pencil</v-icon>Yeniləndi</h2>
                          <p class="body-2 ml-9" v-text="taskSlot.task.updated_at !== null ? taskSlot.task.updated_at.substring(0,10) : null"></p>

                          <h2 class="subtitle-1"><v-icon class="mr-2" small>mdi-link-variant</v-icon>Tapşırıq Nömrəsi</h2>
                          <p class="body-2 ml-9">{{ taskSlot.task.id }}</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </div>
                </v-row>

              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
    </Comment>
  </div>
</template>

<script>

import {mapActions, mapGetters} from 'vuex'
import {Drag, DropList} from "vue-easy-dnd";
import Comment from "./inc/Comment";

export default {
  name: "Project",
  data: () => ({
    statuses_ids: [],
    is_completed: 0,
    colors: ['rgb(217, 54, 81)','rgb(255, 159, 26)','rgb(255, 213, 0)','rgb(138, 204, 71)','rgb(71, 204, 138)',
      'rgb(48, 191, 191)','rgb(0, 170, 255)','rgb(143, 126, 230)','rgb(152, 170, 179)'
    ],
    task: null,
    comment: '',
    showPlusIcon: true,
    addSection: true,
    section_name: '',
    showTextField: false,
    activeItem: '',
    dialog: false,
    task_name: '',
    assign: null,
    showEditStatus: false,
    showStatusActionIcon: false,
    currentStatus: null,
  }),

  computed: {
    ...mapGetters({
      'user': 'auth/user',
      'department': 'auth/department',
      'project': 'project',
      'status': 'status',
      'newTask': 'task',
      'comments': 'comments',
      'getComment': 'getComment'
    }),

  },

  components: {
    Comment,
    Drag,
    DropList,

  },
  mounted() {

    this.getSingleProjectFromApi(this.$route.params.id).then(() => {
      this.project.statuses.forEach((status => {
        this.statuses_ids.push(status.id)
        status.tasks = status.tasks.filter(task => {
          return task.created_by === this.user.id || task.assigned_to === this.user.id
        })
      }))
    })

    this.getDepartment()

  },


  methods: {

    ...mapActions({
      'getSingleProjectFromApi': 'getSingleProjectFromApi',
      'storeStatus': 'storeStatus',
      'storeTask': 'storeTask',
      'changeTaskStatus': 'changeTaskStatus',
      'disAssociateStatusFromProject': 'disAssociateStatusFromProject',
      'getCommentsFromApi': 'getCommentsFromApi',
      'addCommentToApi': 'addCommentToApi',
      'removeTaskFromApi' : 'removeTaskFromApi',
      'getDepartment' : 'auth/getDepartment',
      'assignTask' : 'assignTaskToEmployee',
      'updateTask' : 'updateTask',
      'updateStatusInApi': 'updateStatus'
    }),

    // Take random color for statuses

    takeRandomColor() {
      return Math.floor(Math.random() * this.colors.length)
    },

    editStatus(status) {
      this.showEditStatus = true
      this.section_name = status.name
      this.statuses_ids = this.statuses_ids.filter(stat => stat !== status.id)
    },

    updateStatus(status) {
      if(this.section_name !== status.name) {
        let sec = this.project.statuses.filter(st => {
          if(st.name === this.section_name) {
            return st;
          }
        })

        if(sec.length > 0) {
          this.showEditStatus = false
          this.statuses_ids.push(status.id)

          return true
        }

        this.updateStatusInApi({id: status.id,name: this.section_name, project_id: this.project.id}).then(data => {
          status.name = data.data.name
          this.showEditStatus = false
          this.statuses_ids.push(data.data.id)
        }).catch(() => {
          this.showEditStatus = false
          this.statuses_ids.push(status.id)
        })
      }

      this.showEditStatus = false
      this.statuses_ids.push(status.id)
    },

    clicked(item) {
      this.showTextField = true
      this.activeItem = item
    },
    insert1(data, status_id, event) {
      delete event.data.updated_at
      event.data.status_id = status_id

      this.changeTaskStatus(event.data).then(() => {
        data.splice(event.index, 0, this.newTask);
      })

    },

    getTaskDetails(task) {
      this.dialog = true
      this.task = task

      this.getCommentsFromApi(task.id).then(() => {
        this.assign = this.department.employees.filter(emp => { return emp.id === this.task.assigned_to ? emp.id : null })
        this.assign = this.assign.length > 0 ? this.assign[0].id : null
        this.department.employees = this.department.employees.filter(employee => employee.id !== this.user.id)
        this.task.comments = this.comments.reverse()
      })
    },

    assignTaskToEmployee() {
      let data = this.task
      data.assigned_to = this.assign

      let assigned = this.assignTask(data)

      assigned.then(data => {
        if(data === true) {
          this.task.assigned_to = this.assign
        } else {
          if(this.task.assigned_to) {
            this.assign = this.task.assigned_to
          } else {
            this.assign = null
          }
        }
      })
    },

    removeTask(task) {
      let removed = this.removeTaskFromApi(task)

      removed.then(data=> {
        if(data === true) {
          this.project.statuses.forEach(status => {
            status.tasks = status.tasks.filter(taskStatus => {
              return taskStatus.id !== task.id
            })

            this.dialog = false
          })
        }
      })
    },

    addComment() {
      this.addCommentToApi({task_id: this.task.id, text: this.comment}).then(() => {
        this.task.comments.unshift(this.getComment)
        this.comment = ''
      }).catch(() => {
        this.comment = ''
      })
    },

    taskUpdate(task) {
      
      this.updateTask(task).then((data) => {
        this.is_completed = data.completed
        this.task = data
      })
    },

    generator: function () {
      let mycolor = 'background-color: #' + (Math.random() * 0xFFFFFF << 0).toString(16);
      if (mycolor == '#ffffff') {
        mycolor = 'background-color: #25ef0c'
      }
      return mycolor;
    },

    deleteStatus(status, index) {
      let response = this.disAssociateStatusFromProject({'project_id': this.project.id, 'status_id': status.id})

      response.then(data => {
        if (data.message === 'success') {

          this.$delete(this.project.statuses, index)
        }
      })
    },

    removeItem(array, value) {
      let index = array.indexOf(value);
      array.splice(index, 1);
    },

    addTask(data, status_id) {

      if (this.task_name.length !== 0) {
        this.storeTask({name: this.task_name, status_id, project_id: this.project.id}).then(() => {
          data.push(this.newTask.data)
        })
      }
      this.showTextField = false
      this.activeItem = ''
      this.task_name = ''
    },

    addSectionToApi() {
      if (this.section_name !== '') {
        //Check if status already exists

        let ifStatusExists = this.project.statuses.filter(status => {
          if (status.name === this.section_name) {
            return status
          }
        })


        if (ifStatusExists.length > 0) {
          this.addSection = true
          this.section_name = ''
          return false
        }

        let vm = this
        this.addSection = true
        this.storeStatus({name: vm.section_name,color: this.colors[this.takeRandomColor()], project_id: vm.project.id}).then(() => {
          vm.project.statuses.push(this.status)
          vm.statuses_ids.push(this.status.id)
        })
      } else this.addSection = true
      this.section_name = ''
    }

  },
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.dropListHeight {
  min-height: 54.1vh;
}
.active_status {
  display: none;
}
</style>