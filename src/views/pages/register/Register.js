import React from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "reactstrap";
import Authrule from "../../../component/auth/Authregister";

const Register = () => {
  const [user, setUser] = React.useState({
    user_username: "user",
    user_password: "123456",
    user_passwordre: "123456",
    user_firstname: "",
    user_lastname: "",
    user_uid: "",
  });
  return (
    <>
      {/* <AuthConsumer> */}
      <Authrule /> 
      {/* </AuthConsumer> */}
    </>
  );
};

export default Register;
