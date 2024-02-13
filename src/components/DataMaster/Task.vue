<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Task</h3>

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
        <v-btn color="green" fab dark small @click="dialog = true">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="task"
        :search="search"
        v-bind:style="{ 'white-space': nowrap }"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="item.status_task == 'open'"
            color="blue"
            fab
            dark
            x-small
            @click="changeStatus(item.id)"
          >
            <v-icon>mdi-update</v-icon>
          </v-btn>

          <v-btn
            v-if="item.status_task == 'open' || item.status_task == 'in progress'"
            color="blue"
            fab
            dark
            x-small
            @click="editHandler(item)"
          >
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn color="red" fab dark x-small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>

        <template v-slot:[`item.status_task`]="{ item }">
          <v-chip
            v-if="item.status_task == 'open'"
            class="ma-2"
            color="red"
            text-color="white"
          >
            Open
          </v-chip>

          <v-chip
            v-else-if="item.status_task == 'in progress'"
            class="ma-2"
            color="orange"
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

          <v-chip v-else class="ma-2" color="green" text-color="white">
            Completed
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Task</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.id_project"
              :items="projects"
              item-text="project_code"
              item-value="id"
              label="Event Code"
              outlined
              :rules="idProjectRules"
              required
            ></v-select>

            <v-select
              v-model="form.id_employee"
              :items="employees"
              item-text="employee_name"
              item-value="id"
              label="Assignee Name"
              outlined
              :rules="idEmployeeRules"
              required
            ></v-select>

            <v-select
              v-model="form.id_department"
              :items="departments"
              item-text="department_name"
              item-value="id"
              label="Department Name"
              outlined
              :rules="idDepartmentRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.task_name"
              label="Task Name"
              outlined
              :rules="taskNameRules"
              required
            ></v-text-field>

            <v-select
              v-model="form.task_type"
              :items="['dependence', 'no']"
              label="Task Type"
              :rules="taskTypeRules"
              outlined
              required
            ></v-select>

            <v-select
              v-if="form.task_type == 'dependence'"
              v-model="form.task_depedence_id"
              :items="task"
              item-text="task_name"
              item-value="task_name"
              label="Select"
              multiple
              chips
              outlined
              @input="changed"
              :rules="taskDepedenceRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.description"
              label="Description"
              outlined
            ></v-text-field>

            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.start_date"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="startDateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.start_date"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>

            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.due_date"
                  label="Due Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="dueDateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="form.due_date"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>

          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus data task ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
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
      menu2: false,
      menu1: false,
      headers: [
        { text: "Event Code", value: "project_code" },
        { text: "Employee Name", value: "employee_name" },
        { text: "Department", value: "department_name" },
        //{ text: "Department Name", value: "company_name" },
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
      departments: [],
      form: {
        id_project: null,
        id_employee: null,
        id_department: null,
        //id_company: null,
        task_name: null,
        task_id: null,
        task_type: null,
        task_depedence_id: [],
        description: null,
        start_date: null,
        due_date: null,
        status_task: null,
      },
      idProjectRules: [(v) => !!v || "Event Code Must Be Required"],
      idEmployeeRules: [(v) => !!v || "Employee Name Must Be Required"],
      idDepartmentRules: [(v) => !!v || "Department Name Must Be Required"],
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
      start_date: new Date().toISOString().substr(0, 10),
      due_date: new Date().toISOString().substr(0, 10),
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
      var url = this.$api + "/task";
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
    readDataExcludeByName(name) {
      var url = this.$api + "/listtaskexcludebytaskname/" + name;
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
    //var url = this.$api + "/company";
    //this.$http
    //.get(url, {
    //headers: {
    //Authorization: "Bearer " + localStorage.getItem("token"),
    // },
    //})
    //.then((response) => {
    // this.companies = response.data.data;
    //});
    //},
    readDataDepartment() {
      var url = this.$api + "/department";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.departments = response.data.data;
        });
    },
    //simpan data produk
    save() {
      console.log(this.form.task_depedence_id);
      if (this.$refs.form.validate()) {
        this.tasks.append("id_project", this.form.id_project);
        this.tasks.append("id_employee", this.form.id_employee);
        this.tasks.append("id_department", this.form.id_department);
        //this.tasks.append("id_company", this.form.id_company);
        this.tasks.append("task_name", this.form.task_name);
        this.tasks.append("task_id", this.form.task_id);
        this.tasks.append("task_type", this.form.task_type);
        if (this.form.task_type == "no") {
          this.tasks.append("task_depedence_id", new Array());
        } else {
          this.tasks.append("task_depedence_id", this.form.task_depedence_id);
        }
        this.tasks.append("description", this.form.description);
        this.tasks.append("start_date", this.form.start_date);
        this.tasks.append("due_date", this.form.due_date);
        this.tasks.append("status_task", "open");

        var url = this.$api + "/task";
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
      if (this.form.task_type == "no") {
        this.form.task_depedence_id = [];
      }
      let newData = {
        id_project: this.form.id_project,
        id_employee: this.form.id_employee,
        id_department: this.form.id_department,
        //id_company: this.form.id_company,
        task_name: this.form.task_name,
        task_id: this.form.task_id,
        task_type: this.form.task_type,

        task_depedence_id: this.form.task_depedence_id,
        description: this.form.description,
        start_date: this.form.start_date,
        due_date: this.form.due_date,
        status_task: this.form.status_task,
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
      item.task_depedence_id = item.task_depedence_id.substring(
        "1",
        item.task_depedence_id.length - 1
      );

      item.task_depedence_id = item.task_depedence_id
        .replace(/"/g, "")
        .split(",");
      console.log(item.task_depedence_id);
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.id_project = item.id_project;
      this.form.id_employee = item.id_employee;
      this.form.id_department = item.id_department;
      //this.form.id_company = item.id_company;
      this.form.task_name = item.task_name;
      this.form.task_type = item.task_type;
      this.form.task_depedence_id = item.task_depedence_id;
      this.form.description = item.description;
      this.form.start_date = item.start_date;
      this.form.due_date = item.due_date;
      this.form.status_task = item.status_task;
      this.dialog = true;
      this.readDataExcludeByName(item.task_name);
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
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
    this.readDataExcludeByName();
    this.readDataProject();
    this.readDataEmployee();
    //this.readDataCompany();
    this.readDataDepartment();
  },
};
</script>
