<template>
  <div class="dashboard">
    <v-navigation-drawer
      color="#fefae0"
      v-model="drawer"
      class="fullheight"
      width="250"
      border
      app
    >
      <v-list-item>
        <v-list-item-content>
          <img id="logoLogin" src="../assets/mpremove.png" width="50" height="65" alt="Kitten">
        </v-list-item-content>
      </v-list-item>
      
      <v-divider></v-divider>
      <template>
        <v-card color="#fefae0" class="mx-auto" max-width="300" tile>
          <v-list dense>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              link
              tag="router-link"
              :to="item.to"
            >
              <v-list-item-icon>
                <v-icon color="#001d3d" v-text="item.icon"> </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text" v-text="item.text">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="#fefae0" app fixed height="80px">
      <v-app-bar-nav-icon
        color="#001d3d"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn @click="logout" text router>
          <v-icon color="#001d3d">mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  data() {
    return {
      drawer: true,
      error_message: "",
      snackbar: false,
      items: [
        { text: "Dashboard", icon: "mdi-view-dashboard", to: "/dashboard" },
        { text: "Department", icon: "mdi-office-building", to: "/department" },
        { text: "Employee", icon: "mdi-account-group", to: "/employee" },
        { text: "Event", icon: "mdi-text-box", to: "/project" },
        { text: "Task", icon: "mdi-file-document-edit", to: "/task" },
        { text: "Ticket", icon: "mdi-ticket-confirmation", to: "/ticket" },
        { text: "Summary Status Assignee", icon: "mdi-clipboard-text", to: "/summaryassignee" },
        { text: "Summary Status Review", icon: "mdi-clipboard-text", to: "/summaryreview" },
        { text: "Detail List Assignee", icon: "mdi-clipboard-list", to: "/assignee" },
        { text: "Detail List Review", icon: "mdi-clipboard-list", to: "/reviewer" },
        { text: "Calendar", icon: "mdi-calendar-month", to: "/calendar" },
        //{ text: "Calendar Year", icon: "mdi-checkbook", to: "/calendaryearevent" },
        //{ text: "Calendar Event", icon: "mdi-checkbook", to: "/calendarevent" },
        //{ text: "Calendar Assignee", icon: "mdi-checkbook", to: "/calendarassignee" },
      ],
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");

      this.$router.push({
        name: "Login",
      });
    },
  },
};
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}

.router {
  text-decoration: none;
  color: rgb(255, 255, 255);
}

.v-list-item__title {
  color: rgb(255, 190, 71);
  font-size: 30px;
}
</style>
