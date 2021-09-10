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
  const [qrcode, setQrcode] = useState({});
  const [checkin, setCheckin] = useState({});

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    setUser(user_session);
    let coded = code.params.code;

    const qrcode = await qrcode_model.getQrcodeByCode({
      qr_code: coded,
    });
    const date = new Date();
    let lastcode =
      "CK" +
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, "0");
    const qrcode_data = await checkin_model.getCheckinLastCode({
      code: lastcode,
      digit: 4,
    });

    let room = {};
    room = qrcode.data[0];
    room.qr_code = coded;
    setQrcode(room);

    let day = {};
    day.check_code = qrcode_data.data;
    day.date = new Date();
    day.time_out = time_controller.reformatToTime(room.qr_timeout);
    day.time_stamp = time_controller.reformatToTime(day.date);
    setCheckin(day);

    
    let url = {}
    url.qr = room.qr_code 
    url.classID = room.classgroup_code
    _checkSubmit(user_session.user_code,url);
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
      qr_code: qrcode.qr_code,
      longtititude: position.longtititude,
      latitude: position.latitude,
    });
    if (query_result.require) {
      checkin.time_stamp < checkin.time_out
        ? Swal.fire("ทันเวลา ", "", "success")
        : Swal.fire("ไม่ทันเวลา ", "", "error");
      let histy = " / checkin - student / history / " + qrcode.classgroup_code;
      history.push(histy);
    } else {
      Swal.fire("บันทึกไม่สำเร็จ", "", "error");
    }
  }

  const _checkSubmit = async (user, qr) => { 
    const query_result = await checkin_model.getCheckinBy({
      keyword: user,
      owner: qr.qr,
    });  
    if (query_result.data.length !== 0) {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "ไม่สามารถลงชื่อซ้ำได้",
        icon: "warning",
      });
      let histy = "/checkin-student/history/" + qr.classID; 
      history.push(histy);
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <CContainer style={{ width: "350px", paddingTop: "20px" }}>
        <CCard>
          <CCardBody>
            <CRow>
              <CCol className="text-center">
                <CLabel style={{ fontSize: "25px" }}>
                  {checkin.time_stamp}
                </CLabel>

                <br />
                <CLabel style={{ fontSize: "20px" }}>
                  {qrcode.subject_code}
                </CLabel>
                <br />
                <CLabel style={{ fontSize: "20px" }}>
                  {qrcode.subject_name}
                </CLabel>
              </CCol>
              <br />
              <CCol lg="12" className="text-center">
                <CLabel style={{ fontSize: "18" }}>อาจารย์ประจำวิชา</CLabel>
                <br />
                <CLabel style={{ fontSize: "16" }}>
                  {qrcode.owner_fullname}
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
