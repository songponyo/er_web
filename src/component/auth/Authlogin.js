import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode";

import { AuthProvider } from "../../role-accress/authContext";

import Authoring from "./Authoring";

import GLOBAL from "../../GLOBAL";

import UserModel from "../../models/UserModel";

const user_model = new UserModel();

export default function Authlogin() {
  const [user, setUser] = useState();
  const [permission, setPermission] = useState({});
  const [authcertifying, setAuthcertifying] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleAuthentication();
  }, []);

  async function handleAuthentication() {
    try {
      const serialized = localStorage.getItem("session-user");

      if (serialized !== null) {
        const login_token = JSON.parse(serialized);

        const login_result = await user_model.checkLogin({
          user_username: login_token.user_username,
          user_password: login_token.user_password,
        });
        setLoading(false);
        setAuthcertifying(false);

        if (login_result.require === true && login_result.data.length) {
          setPermission({
            ...permission,
            x_access_token: login_result.x_access_token,
            permissions_token: login_result.permissions_token,
            user: login_result.data[0],
          });
        }
      } else {
        setLoading(false);
        setAuthcertifying(false);
      }
    } catch (e) {
      console.log("handleAuthentication ", e);
    }
  }

  return (
    <AuthProvider value={authProviderValue}>
      {authcertifying ? <Authoring /> : this.props.children}
    </AuthProvider>
  );
}
