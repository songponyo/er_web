import React from "react"
const user = React.lazy(() => import("./views/master-data/user"))
const user_position = React.lazy(() => import("./views/master-data/user-position"))
const leave_form = React.lazy(() => import("./views/classroom/leave-form"))

const routes = [
 
  { path: "/user", name: "User", permission_name: 'user', component: user },
  { path: "/user-position", name: "User-position", permission_name: 'user-position', component: user_position },
  { path: "/leave-form", name: "Leave-form", permission_name: 'leave-form', component: leave_form },
  // { path: "/license", name: "License", permission_name: 'license', component: license },
  { path: "/", exact: true, name: "Home" },
]

export default routes
