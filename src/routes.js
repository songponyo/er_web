import React from "react"
const user = React.lazy(() => import("./views/master-data/user"))
const user_position = React.lazy(() => import("./views/master-data/user-position")) 
const course = React.lazy(() => import("./views/master-data/course"))

const leave_form = React.lazy(() => import("./views/class-manage/leave-form"))
const class_group = React.lazy(() => import("./views/class-manage/class-group"))

const class_student = React.lazy(() => import("./views/student/class_student"))
const leave_student = React.lazy(() => import("./views/student/leave_student"))



const routes = [
 
  { path: "/user", name: "User", permission_name: 'user', component: user },
  { path: "/user-position", name: "User-position", permission_name: 'user-position', component: user_position },
  { path: "/leave-form", name: "Leave-form", permission_name: 'leave-form', component: leave_form },
  { path: "/class-group", name: "Class-group", permission_name: 'class_group', component: class_group },
  { path: "/course", name: "Course", permission_name: 'course', component: course }, 
  { path: "/class_student", name: "Class_student", permission_name: 'class_student', component: class_student }, 
  { path: "/leave_student", name: "Leave_student", permission_name: 'leave_student', component: leave_student }, 
  { path: "/", exact: true, name: "Home" },
]

export default routes
