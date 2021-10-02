import React from "react";
const user = React.lazy(() => import("./views/master-data/user"));
const user_position = React.lazy(() => import("./views/master-data/user-position"));
const subject = React.lazy(() => import("./views/master-data/subject"));
const user_register = React.lazy(() =>import("./views/master-data/user-register"));
const all_class = React.lazy(() => import("./views/master-data/all-class"));
const prefix = React.lazy(() => import("./views/master-data/prefix"));


const leave_form = React.lazy(() => import("./views/teacher/leave-form"));
const class_group = React.lazy(() => import("./views/teacher/class-group"));
const checkin_teacher = React.lazy(() =>import("./views/teacher/checkin-teacher"));

const course_student = React.lazy(() =>import("./views/student/course-student"));
const class_student = React.lazy(() => import("./views/student/class-student"));
const leave_student = React.lazy(() => import("./views/student/leave-student"));
const profile = React.lazy(() => import("./views/profile"));
const checkin_student = React.lazy(() =>import("./views/student/checkin-student"));

const routes = [
  { path: "/user", name: "User", permission_name: "user", component: user },
  {
    path: "/user-position",
    name: "User-position",
    permission_name: "user-position",
    component: user_position,
  },
  {
    path: "/leave-form",
    name: "Leave-form",
    permission_name: "leave-form",
    component: leave_form,
  },
  {
    path: "/class-group",
    name: "Class-group",
    permission_name: "class-group",
    component: class_group,
  },
  {
    path: "/subject",
    name: "Subject",
    permission_name: "subject",
    component: subject,
  },
  {
    path: "/class-student",
    name: "Class-student",
    permission_name: "class-student",
    component: class_student,
  },
  {
    path: "/leave-student",
    name: "Leave-student",
    permission_name: "leave-student",
    component: leave_student,
  },
  {
    path: "/course-student",
    name: "Course-student",
    permission_name: "course-student",
    component: course_student,
  },
  {
    path: "/profile",
    name: "Profile",
    permission_name: "profile",
    component: profile,
  },
  {
    path: "/checkin-teacher",
    name: "Checkin-teacher",
    permission_name: "checkin-teacher",
    component: checkin_teacher,
  },
  {
    path: "/checkin-student",
    name: "Checkin-student",
    permission_name: "checkin-student",
    component: checkin_student,
  },
  {
    path: "/user-register",
    name: "user-register",
    permission_name: "user-register",
    component: user_register,
  },
  {
    path: "/all-class",
    name: "all-class",
    permission_name: "all-class",
    component: all_class,
  },
  {
    path: "/prefix",
    name: "prefix",
    permission_name: "prefix",
    component: prefix,
  },
  { path: "/", exact: true, name: "Home" },
];

export default routes;
