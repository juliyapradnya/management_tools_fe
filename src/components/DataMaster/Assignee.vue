<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Detail List Assignee</h3>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        ></v-text-field>

        <v-spacer></v-spacer>
      </v-card-title>

      <v-data-table :headers="headers" :items="task" :search="search">
        <template v-slot:[`item.actions`]="{ item }">

          <v-btn v-if="item.status_task == 'in progress'" color="blue" fab dark x-small @click="changeStatus(item.id)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn v-if="item.status_task == 'in progress'" color="red" fab dark x-small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>

        <template v-slot:[`item.status_task`]="{ item }">
          <v-chip
            v-if="item.status_task == 'in progress'"
            class="ma-2"
            color="orange"
            text-color="white"
            
          >
            In Progress
          </v-chip>

          <v-chip 
            v-else-if="item.status_task == 'reviewing'"
            class="ma-2 "
            color="blue"
            text-color="white"
            >
            
            Reviewing
          </v-chip>

          <v-chip 
            v-else
            class="ma-2"
            color="green"
            text-color="white"
            >
            Completed
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      
      headers: [
        
        { text: "Event Code", value: "project_code" },
        { text: "Employee Name", value: "employee_name" },
        { text: "Department", value: "department_name" },
        //{ text: "Department", value: "employee_department" },
        //{ text: "Company Name", value: "company_name" },
        { text: "Task", value: "task_name" },
        { text: "Task ID", value: "task_id" },
        { text: "Task Type", value: "task_type" },
        { text: "Task Depedence", value: "task_depedence_id" },
        { text: "Description", value: "description" },
        { text: "Start Date", value: "start_date" },
        { text: "Due Date", value: "due_date" },
        { text: "Creation Date", value: "created_at" },
        { text: "Status", value: "status_task" },
        { text: "Actions", value: "actions" },
      ],
      tasks: new FormData(),
      task: [],
      projects: [],
      employees: [],
      tickets:[],
      //companies: [],
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    //read data
    readData() {
      var url = this.$api + "/taskassignee";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.task = response.data.data.map((item) => {
            if(item.task_type == "no"){
              item.task_depedence_id = ""
            }
            if(item.description == 'null'){
              item.description = ""
            }
            return item
          });
        });
    },
    readDataProject() {
      var url = this.$api + "/project";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.projects = response.data.data;
        });
    },
    readDataEmployee() {
      var url = this.$api + "/employee";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.employees = response.data.data;
        });
    },

    readDataTicket(id) {
      var url = this.$api + "/showticket/"+id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.tickets = response.data.data;
        });
    },
    //readDataCompany() {
     // var url = this.$api + "/company";
     // this.$http
     //   .get(url, {
       //   headers: {
       //     Authorization: "Bearer " + localStorage.getItem("token"),
       //   },
      //  })
     //   .then((response) => {
     //     this.companies = response.data.data;
     //   });
  //  },
    //simpan data produk

    //ubah status
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

    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.$refs.form.reset();
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
    this.readDataProject();
    this.readDataEmployee();
    //this.readDataTicket(id);
  },
};
</script>
