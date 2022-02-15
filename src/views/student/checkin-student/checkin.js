import React, { useState, useEffect } from "react";
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
import { useHistory, useRouteMatch } from "react-router-dom";
import Swal from "sweetalert2";
import QrcodeModel from "../../../models/QrcodeModel";
import CheckinModel from "../../../models/CheckinModel";
import ScoreModel from "../../../models/ScoreModel";
import dayjs from "dayjs";

const score_model = new ScoreModel();
const qrcode_model = new QrcodeModel();
const checkin_model = new CheckinModel();

export default function Checkin() {
  let history = useHistory();
  const t = dayjs();
  let code = useRouteMatch("/checkin-student/checkin/:code");
  const [showdetail, setShowdetail] = useState(false);
  const [user, setUser] = useState([]);
  const [qrcode, setQrcode] = useState({});
  const [checkin, setCheckin] = useState({});
  const [Lat, setLat] = useState(0);
  const [Lot, setLot] = useState(0);
  const [checkinstamp, setCheckinstamp] = useState({
    checkin_time: "",
  });

  useEffect(() => {
    fetchData();
    getLocation();
  }, []);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    setLat(lat);
    setLot(lng);
  }

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    setUser(user_session);
    let coded = code.params.code;

    const date = new Date();
    let lastcode =
      "CK" +
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, "0");
    const qrcode_data = await checkin_model.getCheckinLastCode({
      code: lastcode,
      digit: 4,
    });

    const qrcode = await qrcode_model.getQrcodeByCode({
      qr_code: coded,
    });

    let room = {};
    room = qrcode.data[0];
    room.qr_code = coded;
    setQrcode(room);

    // เซ็ทเวลาเช็คอิน
    let day = {};
    day.check_code = qrcode_data.data;
    day.time_stamp = dayjs().$d;
    day.time_out = dayjs.tz(qrcode.data[0].qr_timeout).$d; 
    setCheckin(day);

    let url = {};
    url.qr = room.qr_code;
    url.classID = room.classgroup_code;
    _checkSubmit(user_session.user_code, url);
  }

  async function _handleSubmit() {
    let status_in = "";
    let time_stamp = checkin.time_stamp;
    let time_outs = checkin.time_out;

    time_stamp <= time_outs ? (status_in = "Active") : (status_in = "Inactive"); 
 
    let query_result = await checkin_model.insertCheckin({
      checkin_code: checkin.check_code,
      classgroup_code: qrcode.classgroup_code,
      checkin_time: dayjs(time_stamp).format("YYYY-MM-DD H:mm:ss"),
      checkin_status: status_in,
      user_code: user.user_code,
      qr_code: qrcode.qr_code,
      longitude: Lot,
      latitude: Lat,
    });
    if (query_result.require) {
      if (status_in == "Active") {
        Swal.fire("ทันเวลา ", "", "success");
      } else {
        Swal.fire("ไม่ทันเวลา ", "", "error").then((result) => {
          if (result) {
            score_model
              .updateScoreLeaveBy({
                user_uid: user.user_uid,
                table_name: qrcode.classgroup_table_score,
              })
              .then((res) => {
                if (res.require) {
                  Swal.fire("บันทึกเวลามาสายเรียบร้อย", "", "success");
                  window.location.reload();
                } else {
                  Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
                }
              });
          }
        });
      }
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
      setCheckinstamp(query_result.data[0]);
      setShowdetail(true);
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
            </CRow>
          </CCardBody>
          {showdetail !== true ? (
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
          ) : (
            <CCardFooter>
              <CContainer>
                <CRow>
                  <CCol className="text-center">
                    <CLabel style={{ fontSize: "20px" }}>เวลาที่ลงชื่อ</CLabel>
                    <br />
                    <CLabel style={{ fontSize: "20px" }}>
                      {dayjs.tz(checkinstamp.checkin_time).format("HH:mm")}
                    </CLabel>
                  </CCol>
                </CRow>
              </CContainer>
            </CCardFooter>
          )}
        </CCard>
      </CContainer>
    </>
  );
}
