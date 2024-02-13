<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Detail List Review</h3>

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
          <v-btn v-if="item.status_task == 'reviewing'" color="blue" fab dark x-small @click="editStatusHandler(item.id)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>
        </template>

        <template v-slot:[`item.status_task`]="{ item }">
          <v-chip
            v-if="item.status_task == 'in progress'"
            class="ma-2"
            color="red"
            text-color="white"
            
          >
            In Progress
          </v-chip>

          <v-chip 
            v-else-if="item.status_task == 'reviewing'"
            class="ma-2"
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


    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data task ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      dialogReviewConfirm: false,
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
      //companies: [],
      form: {
        id_project: null,
        id_employee: null,
        //id_company: null,
        task_name: null,
        //task_id: null,
        task_type: null,
        task_depedence_id: null,
        description: null,
        start_date: null,
        due_date: null,
        status_task: null,
      },
      idProjectRules: [(v) => !!v || "Event Code Must Be Required"],
      idEmployeeRules: [(v) => !!v || "Employee Name Must Be Required"],
      //idCompanyRules: [(v) => !!v || "Company Name Must Be Required"],
      taskNameRules: [(v) => !!v || "Task Name Must Be Required"],
      taskTypeRules: [(v) => !!v || "Task Type Must Be Required"],
      taskDepedenceRules: [(v) => !!v || "Task Depedence Must Be Required"],
      descriptionRules: [(v) => !!v || "Description Must Be Required"],
      startDateRules: [(v) => !!v || "Start Date Must Be Required"],
      dueDateRules: [(v) => !!v || "Due Date Must Be Required"],
      statusTaskRules: [(v) => !!v || "Status Must Be Required"],
      deleteId: "",
      editId: "",
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
      var url = this.$api + "/taskreviewinguser";
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
    //readDataCompany() {
    //  var url = this.$api + "/company";
    //  this.$http
     //   .get(url, {
      //    headers: {
        //    Authorization: "Bearer " + localStorage.getItem("token"),
       //   },
      //  })
      //  .then((response) => {
      //    this.companies = response.data.data;
      //  });
 //   },
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.tasks.append("id_project", this.form.id_project);
        this.tasks.append("id_employee", this.form.id_employee);
        //this.tasks.append("id_company", this.form.id_company);
        this.tasks.append("task_name", this.form.task_name);
        this.tasks.append("task_id", this.form.task_id);
        this.tasks.append("task_type", this.form.task_type);
        this.tasks.append("task_depedence_id", this.form.task_depedence_id);
        this.tasks.append("description", this.form.description);
        this.tasks.append("start_date", this.form.start_date);
        this.tasks.append("due_date", this.form.due_date);
        this.tasks.append("status_task", "in progress");

        var url = this.$api + "/task/";
        this.load = true;
        this.$http
          .post(url, this.tasks, {
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
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },

    //ubah status
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
          this.inputType = "Tambah";
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

    //ubah
    update() {
      let newData = {
        id_project          : this.form.id_project,
        id_employee         : this.form.id_employee,
        //id_company          : this.form.id_company,
        task_name           : this.form.task_name,
        task_type           : this.form.task_type,
        task_depedence_id   : this.form.task_depedence_id,
        description         : this.form.description,
        start_date          : this.form.start_date,
        due_date            : this.form.due_date,
        status_task         : this.form.status_task,
      };
      var url = this.$api + "/task/" + this.editId;
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
    //hapus
    deleteData() {
      //mengahapus data
      var url = this.$api + "/task/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
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
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.id_project = item.id_project;
      this.form.id_employee = item.id_employee;
      //this.form.id_company = item.id_company;
      this.form.task_name = item.task_name;
      this.form.task_type = item.task_type;
      this.form.task_depedence_id = item.task_depedence_id;
      this.form.description = item.description;
      this.form.start_date = item.start_date;
      this.form.due_date = item.due_date;
      this.form.status_task = item.status_task;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
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
    //this.readDataCompany();
  },
};
</script>
