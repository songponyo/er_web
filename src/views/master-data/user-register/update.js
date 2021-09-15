import React, { useEffect, useState } from "react";
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
  CImg,
} from "@coreui/react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import Swal from "sweetalert2";
import UserModel from "../../../models/UserModel";
import LicenseModel from "../../../models/LicenseModel";
import UserPositionModel from "../../../models/UserPositionModel";
import { Select } from "../../../component/revel-strap";

const license_model = new LicenseModel();
const user_model = new UserModel();
const user_position_model = new UserPositionModel();

export default function View() {
  let history = useHistory();
  let code = useRouteMatch("/user-register/update/:code");
  const [license, setLicense] = useState([]);
  const [position, setPosition] = useState([]);
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
    const user_data = await user_model.getUserByCode({
      user_code: code.params.code,
    });
    let user_info = {};
    user_info = user_data.data[0];
    setUser(user_info);

    const license_data = await license_model.getLicenseBy({});
    let license_info = license_data.data;
    let selecter_lc = [];
    for (let i = 0; i < license_info.length; i++) {
      selecter_lc.push({
        value: license_info[i].license_code,
        label: license_info[i].license_name,
      });
    }
    setLicense(selecter_lc);

    const position_data = await user_position_model.getUserPositionBy({});
    let position_info = position_data.data;
    let select_ps = [];
    for (let i = 0; i < position_info.length; i++) {
      select_ps.push({
        value: position_info[i].user_position_code,
        label: position_info[i].user_position_name,
      });
    }
    setPosition(select_ps);
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await user_model.updateUserBy({
        user_code: user.user_code,
        user_position_code: user.user_position_code,
        license_code: user.license_code,
        user_prefix: user.user_prefix,
        user_firstname: user.user_firstname,
        user_lastname: user.user_lastname,
        user_tel: user.user_tel,
        user_address: user.user_address,
        user_email: user.user_email,
        user_username: user.user_username,
        user_password: user.user_password,
        user_status: "Active",
        user_zipcode: user.user_zipcode,
      });

      if (query_result.require) {
        Swal.fire("Save success!!", "", "success");
        history.push("/user-register");
      } else {
        Swal.fire("Sorry, Someting worng !", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (user.user_license === "") {
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

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <>
      <div>
        <CCard>
          <CCardHeader className="header-t-red">
            ข้อมูลส่วนตัว / Profile
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="6">
                <CRow>
                  <CCol md="3">
                    <CLabel>รหัสประจำตัว</CLabel>
                  </CCol>
                  <CCol md="7">
                    <CInput
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
                    <CLabel>ชื่อ</CLabel>
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
                  <CCol md="3">
                    <CLabel>นามสกุล</CLabel>
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
              </CCol>
              <CCol md="6">
                <CRow>
                  <CCol md="3">
                    <CLabel>ระดับการเข้าใช้งาน</CLabel>
                  </CCol>
                  <CCol md="7">
                    <Select
                      options={license}
                      value={user.license_code}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          [`license_code`]: e,
                        })
                      }
                    />
                  </CCol>
                </CRow>
                <br />
                <CRow>
                  <CCol md="3">
                    <CLabel>ตำแหน่งงานผู้ใช้</CLabel>
                  </CCol>
                  <CCol md="7">
                    <Select
                      options={position}
                      value={user.user_position_code}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          [`user_position_code`]: e,
                        })
                      }
                    />
                  </CCol>
                </CRow>
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
