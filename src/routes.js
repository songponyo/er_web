import React from "react"
const user = React.lazy(() => import("./views/master-data/user"))
const user_position = React.lazy(() => import("./views/master-data/user-position"))


const routes = [
 
  { path: "/user", name: "User", permission_name: 'user', component: user },
  { path: "/user-position", name: "User-position", permission_name: 'user-position', component: user_position },
  // { path: "/license", name: "License", permission_name: 'license', component: license },
  { path: "/", exact: true, name: "Home" },
]

export default routes
