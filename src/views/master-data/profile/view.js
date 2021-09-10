import React, { useEffect, useState } from "react";
import GLOBAL from "../../../GLOBAL";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CLabel,
  CInput,
  CButton,
  CImg
} from "@coreui/react";

import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import UserModel from "../../../models/UserModel";
import { FileController } from "../../../controller";


const file_controller = new FileController();
const user_model = new UserModel();
export default function View() {
  let history = useHistory();
  const [showloading, setShowLoading] = useState(true);
  const [user, setUser] = useState({
    user_profile_image: {
      src: "default.png",
      file: null,
      old: "",
    },
  })

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    let user_data = {}
    user_data = user_session
    user_data.user_profile_image = {
      src: "default.png",
      file: null,
      old: user_session.user_profile_image
    }
    setUser(user_data);
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
      let user_profile_image = "";
      const res_upload = await file_controller.uploadFile({
        src: user.user_profile_image,
        upload_path: "user/",
      });

      if (res_upload.require) {
        if (user.user_profile_image.src !== "default.png") {
          await file_controller.deleteFile({
            file_path: user.user_profile_image.old,
          });
          user_profile_image = res_upload.data.file_name;
        } else {
          user_profile_image = user.user_profile_image.old;
        }
      } else {
        user_profile_image = user.user_profile_image.old;
      }

      let query_result = await user_model.updateUserBy({

        user_profile_image: user_profile_image,

      });

      if (query_result.require) {
        Swal.fire("Save success!!", "", "success");
        history.push("/profile");
      } else {
        Swal.fire("Sorry, Someting worng !", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (user.user_profile_image === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คชื่อผู้ใช้ ",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <div  >
        <CCard>
          <CCardHeader className="header-t-red">
            ข้อมูลส่วนตัว / Profile
          </CCardHeader>
          <CCardBody >
            <CRow >
              <CCol md="6">
                <CRow>
                  <CCol md="4">
                    <CLabel>
                      ชื่อ
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      type="text"
                      name="user_firstname"
                      value={user.user_firstname}
                      disabled
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="4">
                    <CLabel>
                      นามสกุล
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      type="text"
                      name="user_lastname"
                      value={user.user_lastname}
                      disabled
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="4">
                    <CLabel>
                      อีเมลล์
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      type="text"
                      name="user_email"
                      value={user.user_email}
                      disabled
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="4">
                    <CLabel>
                      รหัสประจำตัว
                    </CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
                      type="text"
                      name="user_username"
                      value={user.user_username}
                      disabled
                    />
                  </CCol>
                </CRow>
                <br />
              </CCol>
              <CCol md="4">
                <CLabel>อัพโหลดภาพ </CLabel>
                <br />
                <CImg
                  name="logo"
                  style={{ width: "350px" }}
                  src={
                    user.user_profile_image.file !== null
                      ? user.user_profile_image.src
                      : user.user_profile_image.old !== ""
                        ? GLOBAL.BASE_SERVER.URL + user.user_profile_image.old
                        : user.user_profile_image.src
                  }
                />
                <br />
                <br />
                <CInput
                  type="file"
                  name="user_profile_image"
                  style={{ border: "none" }}
                  accept="image/png, image/jpeg"
                  onChange={(e) => _handleImageChange("user_profile_image", e)}
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
              บันทึก
            </CButton>
            <Link to="/profile">
              <CButton color="danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>

        </CCard>

      </div>
    </>
  );
}
