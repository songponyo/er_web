import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import moment from "moment";
import {
  CCard,
  CCardBody,
  CContainer,
  CCol,
  CRow,
  CLabel,
  CInput,
  CButton,
  CCardFooter,
} from "@coreui/react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import Swal from "sweetalert2";
import QrcodeModel from "../../../models/QrcodeModel";
import CheckinModel from "../../../models/CheckinModel";
import { TimeController } from "../../../controller";

const qrcode_model = new QrcodeModel();
const checkin_model = new CheckinModel();
const time_controller = new TimeController();

export default function Checkin() {
  let history = useHistory();
  let code = useRouteMatch("/checkin-student/checkin/:code");
  const [user, setUser] = useState([]);
  const [position, setPosition] = useState({
    longtititude: "",
    latitude: "",
  });
  const [classroom, setclassroom] = useState({});
  const [checkin, setCheckin] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    setUser(user_session);

    const date = new Date();
    let lastcode =
      "CK" +
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, "0");

    const qrcode_data = await checkin_model.getCheckinLastCode({
      code: lastcode,
      digit: 4,
    });

    const classroom = await qrcode_model.getQrcodeByCode({
      qr_code: code.params.code,
    });

    let room = {};
    room = classroom.data[0];
    setclassroom(room);

    let day = {};
    day.check_code = qrcode_data.data;
    day.date = new Date();
    day.time_out = time_controller.reformatToTime(room.qr_timeout);
    day.time_stamp = time_controller.reformatToTime(day.date);
    setCheckin(day);

    _checkSubmit(user_session.user_code, room.qr_code);
  }
  async function _handleSubmit() {
    let status_in = "";
    checkin.time_stamp < checkin.time_out
      ? (status_in = "Active")
      : (status_in = "Inactive");

    let query_result = await checkin_model.insertCheckin({
      checkin_code: checkin.check_code,
      checkin_time: time_controller.reformatToDateTime(checkin.date),
      checkin_status: status_in,
      user_code: user.user_code,
      qr_code: classroom.qr_code,
      longtititude: position.longtititude,
      latitude: position.latitude,
    });
    if (query_result.require) {
      checkin.time_stamp < checkin.time_out
        ? Swal.fire("บันทึกเรียบร้อย! ทันเวลา ", "", "success")
        : Swal.fire("บันทึกเรียบร้อย! ไม่ทันเวลา ", "", "success");

      history.push("/checkin-student");
    } else {
      Swal.fire("บันทึกไม่สำเร็จ", "", "error");
    }
  }

  const _checkSubmit = async (user, qr) => {
    const query_result = await checkin_model.getCheckinBy({
      keyword: user,
      owner: qr,
    });
    if (query_result.data !== "") {
      Swal.fire({
        title: "Warning!",
        text: "ไม่สามารถลงชื่อซ้ำ",
        icon: "warning",
      });
      history.push("/checkin-student");
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <CContainer style={{ width: "50%", paddingTop: "20px" }}>
        <CCard>
          <CCardBody>
            <CRow>
              <CCol className="text-center">
                <CLabel style={{ fontSize: "25px" }}>
                  {checkin.time_stamp}
                </CLabel>
                <br />
                <CLabel style={{ fontSize: "25px" }}>
                  {classroom.subject_code}
                </CLabel>
                <br />
                <CLabel style={{ fontSize: "20px" }}>
                  {classroom.subject_name}
                </CLabel>
              </CCol>
              <br />
              <CCol lg="12" className="text-center">
                <CLabel style={{ fontSize: "18" }}>อาจารย์ประจำวิชา</CLabel>
                <br />
                <CLabel style={{ fontSize: "16" }}>
                  {classroom.owner_fullname}
                </CLabel>
              </CCol>
              <CCol lg="12">
                <br />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CContainer>
              <CRow>
                <CCol align="center">
                  <CButton
                    type="button"
                    color="success"
                    size="xs"
                    onClick={() => _handleSubmit()}
                  >
                    เช็คชื่อ
                  </CButton>
                </CCol>
              </CRow>
            </CContainer>
          </CCardFooter>
        </CCard>
      </CContainer>
    </>
  );
}
