<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">Calendar Year Assignee</h3>
    <v-card>
      <v-row class="fill-height">
        <v-col>
          <div class="text-right mb-2 mr-5">
            <v-btn
              outlined
              color="grey darken-2"
              v-bind="attrs"
              v-on="on"
              href="/calendarassignee"
            >
              Calendar Month
            </v-btn>
          </div>
          <Calendar
            :data-source="getDataSource"
            @mouse-on-day="mouseOnDay"
            @mouse-out-day="mouseOutDay"
          ></Calendar>
        </v-col>
      </v-row>
    </v-card>
  </v-main>
</template>

<script>
import Calendar from "v-year-calendar";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
export default {
  components: {
    Calendar,
  },
  methods: {
    getDataSource: function (year) {
      var url = "";
      url = this.$api + "/listTaskByYear/" + year;

      const headers = {
        Authorization: "Bearer " + localStorage.getItem("token"),
      };

      return fetch(url, { headers })
        .then((result) => result.json())
        .then((result) => {
          console.log(result);
          if (result.data) {
            return result.data.map((r) => ({
              startDate: new Date(r.start_date),
              endDate: new Date(r.due_date),
              name: r.employee_name,
            }));
          }

          return [];
        });
    },
    
    mouseOnDay: function (e) {
      console.log(e.events);
      if (e.events.length > 0) {
        var content = "";

        if (e.events.length == 1) {
          content = e.events[0].name
        } else {
          for (var i in e.events) {
            content += e.events[i].name + ", ";
          }
        }

        if (this.tooltip != null) {
          this.tooltip.destroy();
          this.tooltip = null;
        }

        this.tooltip = tippy(e.element, {
          placement: "right",
          content: content,
          animateFill: false,
          animation: "shift-away",
          arrow: true,
        });
        this.tooltip.show();
      }
    },
    mouseOutDay: function () {
      if (this.tooltip !== null) {
        this.tooltip.destroy();
        this.tooltip = null;
      }
    },
  },
  computed: {
    formatDate(date) {
      const today = date;
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1; // Months start at 0!
      let dd = today.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      return dd + "-" + mm + "-" + yyyy;
    },
  },
};
</script>
