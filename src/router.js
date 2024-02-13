import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        
           // Login
            {
                path: "/login",
                name: "Login",
                meta: {title: 'Login'},
                component: importComponent('Login'),
            },
            {
                path: "/",
                component: importComponent('DashboardLayout'),
                children: [
                    //Dashboard
                    {
                        path: "/dashboard",
                        name: "Dashboard",
                        meta: {title: 'Dashboard'},
                        component: importComponent('Dashboard'),
                    },

                    //Company
                    {
                        path: "/department",
                        name: "Department",
                        meta: {title: 'Department'},
                        component: importComponent('DataMaster/Department'),
                    },

                    //Employee
                    {
                        path: "/employee",
                        name: "Employee",
                        meta: {title: 'Employee'},
                        component: importComponent('DataMaster/Employee'),
                    },

                    //Project
                    {
                        path: "/project",
                        name: "Project",
                        meta: {title: 'Project'},
                        component: importComponent('DataMaster/Project'),
                    },

                    //Ticket
                    {
                        path: "/ticket",
                        name: "Ticket",
                        meta: {title: 'Ticket'},
                        component: importComponent('DataMaster/Ticket'),
                    },

                    //Task
                    {
                        path: "/task",
                        name: "Task",
                        meta: {title: 'Task'},
                        component: importComponent('DataMaster/Task'),
                    },

                    //Assignee
                    {
                        path: "/assignee",
                        name: "Assignee",
                        meta: {title: 'Assignee'},
                        component: importComponent('DataMaster/Assignee'),
                    },

                    //Review
                    {
                        path: "/reviewer",
                        name: "Reviewer",
                        meta: {title: 'Reviewer'},
                        component: importComponent('DataMaster/Reviewer'),
                    },

                    //Calendar
                    {
                        path: "/calendar",
                        name: "Calendar",
                        meta: {title: 'Calendar'},
                        component: importComponent('DataMaster/Calendar'),
                    },

                    //Calendar Event
                    {
                        path: "/calendarevent",
                        name: "CalendarEvent",
                        meta: {title: 'CalendarEvent'},
                        component: importComponent('DataMaster/CalendarEvent'),
                    },

                    //Calendar Assignee
                    {
                        path: "/calendarassignee",
                        name: "CalendarAssignee",
                        meta: {title: 'CalendarAssignee'},
                        component: importComponent('DataMaster/CalendarAssignee'),
                    },

                    //Calendar Assignee
                    {
                        path: "/calendarstage",
                        name: "CalendarStage",
                        meta: {title: 'CalendarStage'},
                        component: importComponent('DataMaster/CalendarStage'),
                    },

                    //Summary Assignee
                    {
                        path: "/summaryassignee",
                        name: "SummaryAssignee",
                        meta: {title: 'SummaryAssignee'},
                        component: importComponent('DataMaster/SummaryAssignee'),
                    },

                    {
                        path: "/summaryreview",
                        name: "SummaryReview",
                        meta: {title: 'SummaryReview'},
                        component: importComponent('DataMaster/SummaryReview'),
                    },

                    {
                        path: "/calendaryeartask",
                        name: "CalendarYearTask",
                        meta: {title: 'CalendarYearTask'},
                        component: importComponent('DataMaster/CalendarYearTask'),
                    },

                    {
                        path: "/calendaryearassignee",
                        name: "CalendarYearAssignee",
                        meta: {title: 'CalendarYearAssignee'},
                        component: importComponent('DataMaster/CalendarYearAssignee'),
                    },

                    {
                        path: "/calendaryearevent",
                        name: "CalendarYearEvent",
                        meta: {title: 'CalendarYearEvent'},
                        component: importComponent('DataMaster/CalendarYearEvent'),
                    },
                ]
            },

            {
                path: "/",
                component: importComponent('DashboardLayoutUser'),
                name: "dashboardlayoutuser",
                children: [

                    {
                        path: "/dashboarduser",
                        name: "DashboardUser",
                        meta: {title: 'DashboardUser'},
                        component: importComponent('DashboardUser'),
                    },
                   
                    //Company
                    {
                        path: "/departmentuser",
                        name: "DepartmentUser",
                        meta: {title: 'DepartmentUser'},
                        component: importComponent('DataMasterUser/DepartmentUser'),
                    },

                    //Employee
                    {
                        path: "/employeeuser",
                        name: "EmployeeUser",
                        meta: {title: 'EmployeeUser'},
                        component: importComponent('DataMasterUser/EmployeeUser'),
                    },

                    //Project
                    {
                        path: "/projectuser",
                        name: "ProjectUser",
                        meta: {title: 'ProjectUser'},
                        component: importComponent('DataMasterUser/ProjectUser'),
                    },

                    //Ticket
                    {
                        path: "/ticketuser",
                        name: "TicketUser",
                        meta: {title: 'TicketUser'},
                        component: importComponent('DataMasterUser/TicketUser'),
                    },

                    //Task
                    {
                        path: "/taskuser",
                        name: "TaskUser",
                        meta: {title: 'TaskUser'},
                        component: importComponent('DataMasterUser/TaskUser'),
                    },

                    //Assignee
                    {
                        path: "/assigneeuser",
                        name: "AssigneeUser",
                        meta: {title: 'AssigneeUser'},
                        component: importComponent('DataMasterUser/AssigneeUser'),
                    },

                    //Review
                    {
                        path: "/revieweruser",
                        name: "ReviewerUser",
                        meta: {title: 'ReviewerUser'},
                        component: importComponent('DataMasterUser/ReviewerUser'),
                    },

                    //Calendar
                    {
                        path: "/calendaruser",
                        name: "CalendarUser",
                        meta: {title: 'CalendarUser'},
                        component: importComponent('DataMasterUser/CalendarUser'),
                    },

                    //Calendar Event
                    {
                        path: "/calendareventuser",
                        name: "CalendarEventUser",
                        meta: {title: 'CalendarEventUser'},
                        component: importComponent('DataMasterUser/CalendarEventUser'),
                    },

                    //Calendar Assignee
                    {
                        path: "/calendarassigneeuser",
                        name: "CalendarAssigneeUser",
                        meta: {title: 'CalendarAssigneeUser'},
                        component: importComponent('DataMasterUser/CalendarAssigneeUser'),
                    },

                    //Calendar Assignee
                    {
                        path: "/calendarstageuser",
                        name: "CalendarStageUser",
                        meta: {title: 'CalendarStageUser'},
                        component: importComponent('DataMasterUser/CalendarStageUser'),
                    },

                    //Summary Assignee
                    {
                        path: "/summaryassigneeuser",
                        name: "SummaryAssigneeUser",
                        meta: {title: 'SummaryAssigneeUser'},
                        component: importComponent('DataMasterUser/SummaryAssigneeUser'),
                    },

                    {
                        path: "/summaryreviewuser",
                        name: "SummaryReviewUser",
                        meta: {title: 'SummaryReviewUser'},
                        component: importComponent('DataMasterUser/SummaryReviewUser'),
                    },

                    {
                        path: "/calendaryeartaskuser",
                        name: "CalendarYearTaskUser",
                        meta: {title: 'CalendarYearTaskUser'},
                        component: importComponent('DataMasterUser/CalendarYearTaskUser'),
                    },

                    {
                        path: "/calendaryearassigneeuser",
                        name: "CalendarYearAssigneeUser",
                        meta: {title: 'CalendarYearAssigneeUser'},
                        component: importComponent('DataMasterUser/CalendarYearAssigneeUser'),
                    },

                    {
                        path: "/calendaryeareventuser",
                        name: "CalendarYearEventUser",
                        meta: {title: 'CalendarYearEventUser'},
                        component: importComponent('DataMasterUser/CalendarYearEventUser'),
                    },
                    
                ]
              },

        {
            path: '*',
            redirect: '/'
        },

    ]
});

//set judul


export default router;