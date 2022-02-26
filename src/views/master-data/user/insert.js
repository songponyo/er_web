import React, { useState, useEffect } from "react";
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
  CFormGroup,
  CForm,
} from "@coreui/react";
import { Input } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { Select } from "../../../component/revel-strap";

import LicenseModel from "../../../models/LicenseModel";
import UserModel from "../../../models/UserModel";
import UserPositionModel from "../../../models/UserPositionModel";
import { Uploadimage } from "../../../controller";
import { useHistory } from "react-router-dom";
import PrefixModel from "../../../models/PrefixModel";

const license_model = new LicenseModel();
const user_model = new UserModel();
const user_position_model = new UserPositionModel();
const upload_contoller = new Uploadimage();
const prefix_model = new PrefixModel();

export default function Insert() {
  let history = useHistory();
  const [user, setUser] = useState({
    user_uid: "",
    user_username: "",
    user_profile_image: {
      src: "default.png",
      file: null,
      old: "",
    },
  });
  const [postion, setPostion] = useState([]);
  const [userstatus, setUserstatus] = useState([]);
  const [prefix, setPrefix] = useState();
  const [license_options, setLicense_options] = useState();

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const date = new Date();
    const last_code = await user_model.getUserMaxCode({
      code: "U" + date.getFullYear(),
      digit: 3,
    });
    let user_info = {};
    user_info.user_code = last_code.data;
    user_info.user_uid = "";
    user_info.user_username = "";
    user_info.user_profile_image = {
      src: "default.png",
      file: null,
      old: "",
    };
    setUser(user_info);

    const position_data = await user_position_model.getUserPositionBy({});
    let position_info = position_data.data;
    let selecter_posti = [];
    for (let i = 0; i < position_info.length; i++) {
      selecter_posti.push({
        value: position_info[i].user_position_code,
        label: position_info[i].user_position_name,
      });
    }
    setPostion(selecter_posti);

    const license_data = await license_model.getLicenseBy({});
    let license_info = license_data.data;
    let selecter_li = [];
    for (let i = 0; i < license_info.length; i++) {
      selecter_li.push({
        value: license_info[i].license_code,
        label: license_info[i].license_name,
      });
    }
    setLicense_options(selecter_li);

    const prefix_data = await prefix_model.getPrefixBy({});
    let prefix_info = prefix_data.data;
    let select_pre = [];
    for (let i = 0; i < prefix_info.length; i++) {
      select_pre.push({
        value: prefix_info[i].prefix_code,
        label: prefix_info[i].prefix_name,
      });
    }
    setPrefix(select_pre);

    const user_status_options = [
      { value: "Active", label: "ใช้งาน" },
      { value: "Deactive", label: "ไม่ได้ใช้งาน" },
    ];
    setUserstatus(user_status_options);
  }

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    value.replace(" ", "");
    if (name === "user_firstname" || name === "user_lastname") {
      let th = value.replace(/[0-9-+]/gi, "");
      // value.replace(/[A-Za-z]/gi, "");
      setUser({ ...user, [name]: th.replace(" ", "") });
    } else if (name === "user_uid") {
      let code = value.replace(/[^0-9-+]/gi, "");
      setUser({ ...user, [name]: code.replace(" ", "") });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

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
      // let img = "";
      // if (user.user_profile_image.file !== null) {
      //   const res_upload = await upload_contoller.uploadFile({
      //     src: user.user_profile_image,
      //     upload_path: "users",
      //   });
      //   if (res_upload !== "") {
      //     img = res_upload;
      //   } else {
      //     img = user.user_profile_image.old;
      //   }
      // } else {
      //   img = user.user_profile_image.old;
      // }
      // let query_result = await user_model.insertUser({
      //   user_code: user.user_code,
      //   user_position_code: user.user_position_code,
      //   user_uid: user.user_uid,
      //   license_code: user.license_code,
      //   user_prefix: user.user_prefix,
      //   user_firstname: user.user_firstname,
      //   user_lastname: user.user_lastname,
      //   user_tel: user.user_tel,
      //   user_address: user.user_address,
      //   user_lineId: user.user_lineId,
      //   user_email: user.user_email,
      //   user_username: user.user_username,
      //   user_password: user.user_password,
      //   user_status: user.user_status,
      //   user_zipcode: user.user_zipcode,
      //   user_profile_image: img,
      // });
      // if (query_result.require) {
      //   Swal.fire("บันทึกเรียบร้อย", "", "success");
      //   // history.push("/user");
      // } else {
      //   Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
      // }
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
    } else if (user.user_code === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คไอดีผู้ใช้",
        icon: "warning",
      });
      return false;
    }
    {
      return true;
    }
  };

  const checkUser = async () => {
    await user_model
      .checkUser({
        user_username: user.user_username,
        user_uid: user.user_uid,
      })
      .then((result) => {
        if (result.data.length !== 0 && user.user_uid !== "") {
          Swal.fire({
            title: "หมายเลขไอดีนี้มีผู้ใช้อยู่แล้ว",
            text: "โปรดลองใหม่อีกครั้ง",
            icon: "warning",
          });
          setUser({ ...user, user_uid: "" });
        } else if (result.data.length !== 0 && user.user_username !== "") {
          Swal.fire({
            title: "ชื่อนี้มีผู้ใช้แล้ว",
            icon: "warning",
          });
          setUser({ ...user, user_username: "" });
        }
      });
  };

  const checkDuplicatPassword = async () => {
    if (
      user.user_passwordre !== "" &&
      user.user_password !== user.user_passwordre
    ) {
      Swal.fire("รหัสผ่านไม่ตรงกัน", "", "warning");
    } else {
      const date = new Date();
      const last_code = await user_model.getUserMaxCode({
        code: "U" + date.getFullYear(),
        digit: 3,
      });
      setUser({ ...user, user_code: last_code.data });
    }
  };

  return (
    <>
      <div className="animated fadeIn">
        <CForm autoComplete="off">
          <CCard>
            <CCardHeader className="header-t-red">
              เพิ่มบัญชีผู้ใช้งาน
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md="8">
                  <CRow>
                    <CCol md="3">
                      <CLabel>
                        ไอดีบัญชีผู้ใช้{" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <Input
                        type="text"
                        name="user_uid"
                        value={user.user_uid}
                        onChange={(e) => _changeFrom(e)}
                        onBlur={checkUser}
                        required
                        maxLength={15}
                        minLength={4}
                      />
                    </CCol>
                    <CCol md="3">
                      <CFormGroup>
                        <CLabel>
                          คำนำหน้า{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>
                        </CLabel>
                        <Select
                          options={prefix}
                          value={user.user_prefix}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              [`user_prefix`]: e,
                            })
                          }
                          required
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol md="3">
                      <CFormGroup>
                        <CLabel>
                          ชื่อ{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>
                        </CLabel>
                        <Input
                          type="text"
                          id="user_firstname"
                          name="user_firstname"
                          value={user.user_firstname}
                          onChange={(e) => _changeFrom(e)}
                          required
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol md="3">
                      <CFormGroup>
                        <CLabel>
                          นามสกุล{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>
                        </CLabel>
                        <Input
                          type="text"
                          id="user_lastname"
                          name="user_lastname"
                          value={user.user_lastname}
                          onChange={(e) => _changeFrom(e)}
                          required
                        />
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md="3">
                      <CFormGroup>
                        <CLabel>อีเมล์ </CLabel>
                        <Input
                          type="email"
                          id="user_email"
                          name="user_email"
                          value={user.user_email}
                          onChange={(e) => _changeFrom(e)}
                          required
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol md="3">
                      <CFormGroup>
                        <CLabel>เบอร์โทรศัพท์ </CLabel>
                        <Input
                          type="tel"
                          id="user_tel"
                          name="user_tel"
                          value={user.user_tel}
                          onChange={(e) => _changeFrom(e)}
                          required
                        />
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md="3">
                      <CFormGroup>
                        <CLabel>ชื่อบัญชีผู้ใช้</CLabel>
                        <Input
                          type="text"
                          id="user_username"
                          name="user_username"
                          value={user.user_username}
                          onChange={(e) => _changeFrom(e)}
                          onBlur={checkUser}
                          autocomplete="new-password"
                          required
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol md="3">
                      <CFormGroup>
                        <CLabel>รหัสผ่าน</CLabel>
                        <Input
                          type="text"
                          id="user_password"
                          name="user_password"
                          value={user.user_password}
                          onChange={(e) => _changeFrom(e)}
                          required
                        />
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md="4">
                      <CFormGroup>
                        <CLabel>
                          ตำแหน่ง{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </CLabel>
                        <Select
                          options={postion}
                          value={user.user_position_code}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              [`user_position_code`]: e,
                            })
                          }
                          required
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol md="4">
                      <CFormGroup>
                        <CLabel>
                          สิทธิ์การใช้งาน{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </CLabel>
                        <Select
                          options={license_options}
                          value={user.license_code}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              [`license_code`]: e,
                            })
                          }
                          required
                        />
                        <p className="text-muted"></p>
                      </CFormGroup>
                    </CCol>
                    <CCol md="4">
                      <CFormGroup>
                        <CLabel>
                          สถานะ{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </CLabel>
                        <Select
                          options={userstatus}
                          value={user.user_status}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              [`user_status`]: e,
                            })
                          }
                          required
                        />
                      </CFormGroup>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol md="4">
                  <CFormGroup>
                    <CLabel>โปรไฟล์ </CLabel>
                    <br></br>
                    <div className="text-center">
                      <CImg
                        className="imag-circle"
                        name="logo"
                        // style={{ width: "350px" }}
                        src={
                          user.user_profile_image.file !== null
                            ? user.user_profile_image.src
                            : user.user_profile_image.old !== ""
                            ? user.user_profile_image.old
                            : user.user_profile_image.src
                        }
                      />
                    </div>
                    <Input
                      type="file"
                      name="user_profile_image"
                      style={{ border: "none" }}
                      accept="image/png, image/jpeg"
                      onChange={(e) =>
                        _handleImageChange("user_profile_image", e)
                      }
                    />
                  </CFormGroup>
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
              <Link to="/user">
                <CButton type="button" color="danger">
                  ย้อนกลับ{" "}
                </CButton>
              </Link>
            </CCardFooter>
          </CCard>
        </CForm>
      </div>
    </>
  );
}
