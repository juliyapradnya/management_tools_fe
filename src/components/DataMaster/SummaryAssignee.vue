<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Summary Status Assignee</h3>

    <v-card>
      <v-row class="fill-height">
        <v-col class="d-flex" cols="12" sm="6">
          <div class="text-center mt-5 ">
            <v-sheet class="pa-4 lighten-2">
              <v-text-field
                v-model="search"
                clearable
                flat
                solo-inverted
                hide-details
                prepend-inner-icon="mdi-magnify"
                label="Search"
              ></v-text-field>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
      
      <v-card-text>
        <v-treeview
          hoverable
          :items="task"
          :search="search"
          :filter="filter"
          :open.sync="open"
        >
          <template v-slot:prepend="{ item }">
            <div v-if="item.children" class="d-flex">
              <div>
                <v-btn
                  v-if="item.status_task == 'in progress'"
                  class="mr-1"
                  color="blue"
                  fab
                  dark
                  x-small
                  @click="changeStatus(item.id)"
                >
                  <v-icon>mdi-circle-edit-outline</v-icon>
                </v-btn>
              </div>
              <div>
                <v-chip v-if="item.status_task == 'in progress'" class="mr-2" color="orange" text-color="white" href="/assignee">
                  {{ item.status_task }}
                </v-chip>
                <v-chip v-else class="mr-2" color="blue" text-color="white" href="/reviewer">
                  {{ item.status_task }}
                </v-chip>
              </div>
            </div>

            <v-dialog v-model="dialogShowTask" persistent :retain-focus="false" max-width="450px">
              <v-card>
                <v-card-title>
                  <span class="headline">warning!</span>
                </v-card-title>
                <v-card-text>
                  <hr style="height:2px" />
                    <v-data-table
                      :hide-default-footer="true"
                      :headers="headerShowTask"
                      :items="tasks"
                      :search="search"
                    >
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialogShowTask = false">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  data() {
    return {
      task: [],
      tasks: [],
      open: [1, 2],
      search: null,
      caseSensitive: false,
      error_message: "",
      snackbar: false,
      load: false,
      color: "",
      dialogShowTask: false,
      headerShowTask: [
        {text: "Task", value: "task_name"},
        {text: "Status", value: "status_task"},
      ],
    };
  },

  methods: {
    readData() {
      var url = this.$api + "/showassigneeview";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.task = response.data.data;
          
        });
    },

    changeStatus(id) {
      let newData = {
        status_task: "reviewing",
      };
      var url = this.$api + "/updatestatus/" + id;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.readData(); //mengambil data
          //window.location.href=window.location.href;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    readDataShowTask(id) {
      var url = this.$api + "/listdepedencetask" + id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.tasks = response.data.data;
          //this.close();
        });
    },

    close() {
      this.dialogShowTask = false;
    },
    cancel() {
      this.dialogShowTask = false;
    },
     
    showTaskHandler(item) {
      this.id = item.id;
      this.id_task = item.id_task;
      this.task_name = item.task_name;
      this.status_task = item.status_task;
      this.dialogShowTask = true;
    },
  },
  
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
  },
  mounted() {
    this.readData();
    this.readDataShowTask();
  },
};
</script>
