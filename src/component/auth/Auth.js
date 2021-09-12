import React, { Component } from "react";
import Swal from "sweetalert2";
import jwt_decode from "jwt-decode"; 

import { AuthProvider } from "../../role-accress/authContext";

import Authoring from "./Authoring";

import GLOBAL from "../../GLOBAL";

import UserModel from "../../models/UserModel";

const user_model = new UserModel(); 
class Auth extends Component {
  
  state = {
    loading: true,
    authcertifying: false, 
    authenticated: false,
    permissions: [],
    user: {},
  };
  

  componentDidMount() {
    this.handleAuthentication();
  }

  initiateLogin = (data) => {
    if (this.state.loading === false) {
      this.setState(
        {
          loading: true,
        },
        async () => {
          const login_result = await user_model.checkLogin({
            user_username: data.user_username,
            user_password: data.user_password,
          });

          if (login_result.require === false) {
            this.setState(
              {
                loading: false,
                authcertifying: false,
              },
              () => {
                Swal.fire({
                  title: "ไม่สามารถเข้าสู่ระบบได้",
                  text: "มีบางอย่างผิดพลาด",
                  icon: "error",
                });
              }
            );
          } else if (login_result.data.length === 0) {
            this.setState(
              {
                loading: false,
                authcertifying: false,
              },
              () => {
                Swal.fire({
                  title: "ไม่สามารถเข้าสู่ระบบได้",
                  text: "โปรดเช็ค ชื่อผู้ใช้ และ รหัสผ่านอีกครั้ง",
                  icon: "warning",
                });
              }
            );
          } else {
            this.setSession({
              x_access_token: login_result.x_access_token,
              permissions_token: login_result.permissions_token,
              user: login_result.data[0],
            });
          }
        }
      );
    }
  };

  initiateRegister = (data) => {
    if (this.state.loading === false) {
      this.setState(
        {
          loading: true,
        },
        async () => {
          if (data.user_password !== data.user_passwordre) {
            Swal.fire({
              title: "โปรดตรวจสอบรหัสผ่านอีกครั้ง",
              icon: "error",
            });
          } else {
            const register_result = await user_model.checkUser({
              user_username: data.user_username,
            });
            if (register_result.require === false) {
              this.setState(
                {
                  loading: false,
                  authcertifying: false,
                },
                () => {
                  Swal.fire({
                    title: "ไม่สามารถสมัครสมาชิกได้",
                    text: "มีบางอย่างผิดพลาด",
                    icon: "error",
                  });
                }
              );
            } else if (register_result.data.length !== 0) {
              this.setState(
                {
                  loading: false,
                  authcertifying: false,
                },
                () => {
                  Swal.fire({
                    title: "ไม่สามารถใช้ชื่อนี้ได้",
                    text: "เนื่องจากมีชื่อผู้ใช้นี้แล้ว",
                    icon: "warning",
                  });
                }
              );
            } else {
              const date = new Date();
              const last_code = await user_model.getUserMaxCode({
                code: "U" + date.getFullYear(),
                digit: 3,
              });
              if (last_code.require) { 
                const register_result = await user_model.registertUser({
                  user_code: last_code.data,
                  user_username: data.user_username,
                  user_password: data.user_password,
                  user_firstname: data.user_firstname,
                  user_lastname: data.user_lastname,
                  user_uid: data.user_uid,
                  user_status: "Waiting",
                });
                if (register_result.require) {
                  this.setState(
                    {
                      loading: false,
                      authcertifying: false,
                    },
                    () => {
                      Swal.fire({
                        title: "บันทึกเรียบร้อย",
                        text: "โปรดรอการตรวจสอบจากผู้ดูแล",
                        icon: "success",
                      });  
                    }
                  );
                }
              }
            }
          }
        }
      );
    }
  };

  handleAuthentication = async () => {
    try {
      const serialized = localStorage.getItem("session-user");

      if (serialized !== null) {
        const login_token = JSON.parse(serialized);

        const login_result = await user_model.checkLogin({
          user_username: login_token.user_username,
          user_password: login_token.user_password,
        });

        this.setState(
          {
            loading: false,
            authcertifying: false,
          },
          () => {
            if (login_result.require === true && login_result.data.length) {
              this.setSession({
                x_access_token: login_result.x_access_token,
                permissions_token: login_result.permissions_token,
                user: login_result.data[0],
              });
            }
          }
        );
      } else {
        this.setState({
          loading: false,
          authcertifying: false,
        });
      }
    } catch (e) {
      console.log("handleAuthentication ", e);
    }
  };

  setSession(session) {
    try {
      localStorage.setItem("x-access-token", session.x_access_token);
      localStorage.setItem("session-user", JSON.stringify(session.user));

      GLOBAL.ACCESS_TOKEN = { "x-access-token": session.x_access_token };

      const { permissions } = jwt_decode(session.permissions_token);
      this.setState({
        loading: false,
        authcertifying: false,
        authenticated: true,
        permissions: permissions || [],
        user: session.user,
      });
    } catch (e) {
      console.log("setSession ", e);
    }
  }

  logout() {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      console.log("logout ", e);
    }
  }

  render() {
    const authProviderValue = {
      ...this.state,
      initiateLogin: this.initiateLogin,
      initiateRegister: this.initiateRegister,
      handleAuthentication: this.handleAuthentication,
      logout: this.logout,
    };

    return (
      <AuthProvider value={authProviderValue}>
        {this.state.authcertifying ? <Authoring /> : this.props.children}
      </AuthProvider>
    );
  }
}

export default Auth;
