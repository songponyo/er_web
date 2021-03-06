import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CLabel,
  CButton,
  CImg,
  CForm,
} from "@coreui/react";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import UserModel from "../../models/UserModel";
import { Uploadimage } from "../../controller";
import { Input } from "antd";
const upload_contoller = new Uploadimage();
const user_model = new UserModel();

export default function View() {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    user_profile_image: {
      src: "default.png",
      file: null,
      old: "",
    },
  });

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    const user_data = await user_model.getUserByCode({
      user_code: user_session.user_code,
    });

    let user_info = {};
    user_info = user_data.data[0];
    user_info.user_profile_image = {
      src: "default.png",
      file: null,
      old: user_session.user_profile_image,
    };
    setUser(user_info);
    setIsLoading(true);
  }

  const _handleImageChange = (img_name, e) => {
    if (e.target.files.length) {
      let file = new File([e.target.files[0]], e.target.files[0].name, {
        type: e.target.files[0].type,
      });
      if (file !== undefined) {
        let reader = new FileReader();
        reader.onloadend = () => {
          let new_user = { ...user };
          new_user[img_name] = {
            src: reader.result,
            file: file,
            old: new_user[img_name].old,
          };
          setUser(new_user);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let img = "";
      if (user.user_profile_image.file !== null) {
        const res_upload = await upload_contoller.uploadFile({
          src: user.user_profile_image,
          upload_path: "users",
        });
        if (res_upload !== "") {
          img = res_upload;
        } else {
          img = user.user_profile_image.old;
        }
      } else {
        img = user.user_profile_image.old;
      }
      let query_result = await user_model.updateUserBy({
        user_code: user.user_code,
        user_uid: user.user_uid,
        user_position_code: user.user_position_code,
        license_code: user.license_code,
        user_prefix: user.user_prefix,
        user_firstname: user.user_firstname,
        user_lastname: user.user_lastname,
        user_tel: user.user_tel,
        user_address: user.user_address,
        user_lineId: user.user_lineId,
        user_email: user.user_email,
        user_username: user.user_username,
        user_password: user.user_password,
        user_status: user.user_status,
        user_zipcode: user.user_zipcode,
        user_profile_image: img,
        uppdateby: user.user_uid,
      });
      if (query_result.require) {
        Swal.fire("?????????????????????????????????????????????", "", "success");
        history.push("/profile");
        window.location.reload();
      } else {
        Swal.fire("?????????????????? ???????????????????????????????????????????????????", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (user.user_profile_image === "") {
      Swal.fire({
        title: "???????????????????????????!",
        text: "?????????????????????????????????????????????????????? ",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <div>
      {!isLoading ? (
        <div>
          <CImg src="https://cdn.dribbble.com/users/108183/screenshots/4543219/loader_backinout.gif" />
        </div>
      ) : (
        <CCard>
          <CForm>
            <CCardHeader className="header-t-red">???????????????????????????????????????</CCardHeader>

            <CCardBody>
              <CRow>
                <CCol md="6">
                  <CRow>
                    <CCol md="3">
                      <CLabel>????????????????????????????????????</CLabel>
                    </CCol>
                    <CCol md="7">
                      <Input
                        type="text"
                        name="user_uid "
                        value={user.user_uid}
                        disabled
                      />
                    </CCol>
                  </CRow>
                  <br />
                  <CRow>
                    <CCol md="3">
                      <CLabel>????????????</CLabel>
                    </CCol>
                    <CCol md="7">
                      <Input
                        type="text"
                        name="user_firstname"
                        value={user.user_firstname}
                        disabled
                      />
                    </CCol>
                  </CRow>
                  <br />
                  <CRow>
                    <CCol md="3">
                      <CLabel>?????????????????????</CLabel>
                    </CCol>
                    <CCol md="7">
                      <Input
                        type="text"
                        name="user_lastname"
                        value={user.user_lastname}
                        disabled
                      />
                    </CCol>
                  </CRow>
                  <br />
                  <CRow>
                    <CCol md="3">
                      <CLabel>???????????????</CLabel>
                    </CCol>
                    <CCol md="7">
                      <Input
                        type="email"
                        name="user_email"
                        value={user.user_email}
                        onChange={(e) => _changeFrom(e)}
                      />
                    </CCol>
                  </CRow>
                  <br />
                  <CRow>
                    <CCol md="3">
                      <CLabel>???????????????????????????????????????</CLabel>
                    </CCol>
                    <CCol md="7">
                      <Input
                        type="tel"
                        name="user_tel"
                        value={user.user_tel}
                        onChange={(e) => _changeFrom(e)}
                      />
                    </CCol>
                  </CRow>
                  <br />
                  <CRow>
                    <CCol md="3">
                      <CLabel>????????????????????????</CLabel>
                    </CCol>
                    <CCol md="7">
                      <Input
                        type="text"
                        name="user_lineId"
                        value={user.user_lineId}
                        onChange={(e) => _changeFrom(e)}
                      />
                    </CCol>
                  </CRow>
                  <br />
                </CCol>
                <CCol md="6" align="center">
                  <CLabel>?????????????????????????????? </CLabel>
                  <br />
                  <CImg
                    className="imag-circle"
                    name="logo"
                    src={
                      user.user_profile_image.file !== null
                        ? user.user_profile_image.src
                        : user.user_profile_image.old !== ""
                        ? user.user_profile_image.old
                        : user.user_profile_image.src
                    }
                  />
                  <br />
                  <br />
                  <Input
                    type="file"
                    name="user_profile_image"
                    style={{ border: "none" }}
                    accept="image/png, image/jpeg"
                    onChange={(e) =>
                      _handleImageChange("user_profile_image", e)
                    }
                  />
                </CCol>
              </CRow>
            </CCardBody>

            <CCardFooter>
              <CButton
                type="submit"
                color="success"
                onClick={() => _handleSubmit()}
              >
                ??????????????????
              </CButton>
              <Link to="/">
                <CButton color="danger">????????????????????????</CButton>
              </Link>
            </CCardFooter>
          </CForm>
        </CCard>
      )}
    </div>
  );
}
