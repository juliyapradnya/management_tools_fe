<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Summary Status Review</h3>

    <v-card>
      <v-row class="fill-height">
        <v-col class="d-flex" cols="12" sm="6">
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
        </v-col>
      </v-row>

      <v-dialog v-model="dialogReviewConfirm" persistent max-width="450px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menyelesaikan data task ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="changeStatus(id)">
            Accept
          </v-btn>
          <v-btn color="blue darken-1" text @click="cancelStatus(id)">
            Decline
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialogReviewConfirm = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                  v-if="item.status_task == 'reviewing' || item.status_task == 'completed'"
                  class="mr-1"
                  color="blue"
                  fab
                  dark
                  x-small
                  @click="editStatusHandler(item.id)"
                >
                  <v-icon>mdi-circle-edit-outline</v-icon>
                </v-btn>
              </div>
              <div>
                <v-chip v-if="item.status_task == 'reviewing'" class="mr-2" color="blue" text-color="white" href="/reviewer">
                  {{ item.status_task }}
                </v-chip>
                 <v-chip v-if="item.status_task == 'completed'" class="mr-2" color="green" text-color="white" href="/reviewer">
                  {{ item.status_task }}
                </v-chip>
              </div>
            </div>
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
      open: [1, 2],
      search: null,
      caseSensitive: false,
      error_message: "",
      snackbar: false,
      load: false,
      color: "",
      dialogReviewConfirm: false,
    };
  },

  methods: {
    readData() {
      var url = this.$api + "/showreviewview";
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
        status_task: "completed",
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
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          //window.location.href=window.location.href;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    cancelStatus(id) {
      let newData = {
        status_task: "in progress",
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
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    editStatusHandler(id) {
      this.id = id;
      this.dialogReviewConfirm = true;
    },

    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.dialogReviewConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogReviewConfirm = false;
      this.inputType = "Tambah";
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
  },
};
</script>
