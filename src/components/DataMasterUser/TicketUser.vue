<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Ticket</h3>

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

      <v-data-table :headers="headers" :items="ticket" :search="search">
        <template v-slot:[`item.actions`]="{ item }">

          <v-btn color="blue" fab dark x-small @click="updateTicket(item.id)">
            <v-icon>mdi-update</v-icon>
          </v-btn>

          <v-btn color="blue" fab dark x-small @click="editHandler(item)">
            <v-icon>mdi-circle-edit-outline</v-icon>
          </v-btn>

          <v-btn color="red" fab dark x-small @click="deleteHandler(item.id)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </template>

        <template v-slot:[`item.status_ticket`]="{ item }">
          <v-chip
            v-if="item.status_ticket == 'open'"
            class="ma-2"
            color="red"
            text-color="white"
            
          >
            Open
          </v-chip>

          <v-chip 
            v-else
            class="ma-2"
            color="green"
            text-color="white"
            >
            Closed
          </v-chip>
        </template>

      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Ticket</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.id_task"
              :items="tasks"
              item-text="task_name"
              item-value="id"
              label="Task Name"
              outlined
              :rules="idTaskRules"
              required
            ></v-select>

            <v-text-field
              v-model="form.detail_ticket"
              label="Detail"
              outlined
              :rules="detailTicketRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel">
            Cancel
          </v-btn>

          <v-btn color="blue darken-1" text @click="setForm">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus data ticket ini?
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
        
        { text: "Task Name", value: "task_name" },
        { text: "From", value: "name" },
        { text: "Ticket Number", value: "ticket_number" },
        //{ text: "From", value: "from_ticket" },
        //{ text: "To", value: "to_ticket" },
        { text: "Detail", value: "detail_ticket" },
        { text: "Status", value: "status_ticket" },
        { text: "Actions", value: "actions" },
      ],
      tickets: new FormData(),
      ticket: [],
      tasks: [],
      form: {
        id_task: null,
        id_user: null,
        //from_ticket: null,
        //to_ticket: null,
        detail_ticket: null,
        status_ticket: null,
      
      },
      idTaskRules: [(v) => !!v || "Task Name Must Be Required"],
      fromTicketRules: [(v) => !!v || "From Ticket Must Be Required"],
      toTicketRules: [(v) => !!v || "To Ticket Must Be Required"],
      detailTicketRules: [(v) => !!v || "Detail Ticket Must Be Required"],
      deleteId: "",
      editId: "",
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else if (this.inputType === "Ubah"){
        this.update();
      } else {
        this.updateTicket();
      }
    },
    //read data
    readData() {
      var url = this.$api + "/indexticketuser";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.ticket = response.data.data;
        });
    },
    readDataTask() {
      var url = this.$api + "/task";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.tasks = response.data.data;
        });
    },
    
    //simpan data produk
    save() {
      if (this.$refs.form.validate()) {
        this.tickets.append("id_task", this.form.id_task);
        this.tickets.append("id_user", localStorage.getItem("id"));
        //this.tickets.append("from_ticket", this.form.from_ticket);
        //this.tickets.append("to_ticket", this.form.to_ticket);
        this.tickets.append("detail_ticket", this.form.detail_ticket);
        this.tickets.append("status_ticket", "open");

        var url = this.$api + "/ticket/";
        this.load = true;
        this.$http
          .post(url, this.tickets, {
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
    //ubah
    update() {
      let newData = {
        id_task: this.form.id_task,
        id_user: localStorage.getItem("id"),
        //from_ticket: this.form.from_ticket,
        //to_ticket: this.form.to_ticket,
        ticket_number: this.form.ticket_number,
        detail_ticket: this.form.detail_ticket,
        status_ticket: this.form.status_ticket,
      };
      var url = this.$api + "/ticket/" + this.editId;
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

    updateTicket(id) {
      let newData = {
        status_ticket: "closed",
      };
      var url = this.$api + "/updatestatusticket/" + id;
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
      var url = this.$api + "/ticket/" + this.deleteId;
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
      this.form.id_task = item.id_task;
      this.form.id_user = item.id_user;
      //this.form.from_ticket = item.from_ticket;
      //this.form.to_ticket = item.to_ticket;
      this.form.detail_ticket = item.detail_ticket;
      this.form.status_ticket = item.status_ticket;
      this.dialog = true;
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
    this.readDataTask();
  },
};
</script>
