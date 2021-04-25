import React from "react"
const user = React.lazy(() => import("./views/master-data/user"))
const user_position = React.lazy(() => import("./views/master-data/user-position")) 
const course = React.lazy(() => import("./views/master-data/course"))

const leave_form = React.lazy(() => import("./views/class-manage/leave-form"))
const class_group = React.lazy(() => import("./views/class-manage/class-group"))

const course_student =  React.lazy(() => import("./views/student/course-student"))
const class_student = React.lazy(() => import("./views/student/class-student"))
const leave_student = React.lazy(() => import("./views/student/leave-student"))



const routes = [
 
  { path: "/user", name: "User", permission_name: 'user', component: user },
  { path: "/user-position", name: "User-position", permission_name: 'user-position', component: user_position },
  { path: "/leave-form", name: "Leave-form", permission_name: 'leave-form', component: leave_form },
  { path: "/class-group", name: "Class-group", permission_name: 'class-group', component: class_group },
  { path: "/course", name: "Course", permission_name: 'course', component: course }, 
  { path: "/class-student", name: "Class-student", permission_name: 'class-student', component: class_student }, 
  { path: "/leave-student", name: "Leave-student", permission_name: 'leave-student', component: leave_student }, 
  { path: "/course-student", name: "Course-student", permission_name: 'course-student', component: course_student }, 
  { path: "/", exact: true, name: "Home" }
]

export default routes
