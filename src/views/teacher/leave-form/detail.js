import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CContainer,
  CLabel,
  CInput,
  CButton,
  CImg,
  CFormGroup,
} from "@coreui/react";
import Swal from "sweetalert2";
import { useHistory, useRouteMatch } from "react-router-dom";
import { TimeController } from "../../../controller";
import { DatePicker } from "../../../component/revel-strap";
import LeaveModel from "../../../models/LeaveModel";
import dayjs from "dayjs";
import "dayjs/locale/th";

const leave_model = new LeaveModel();
const time_controller = new TimeController();

export default function Detail() {
  let history = useHistory();

  let code = useRouteMatch("/leave-form/detail/:code");
  const [user, setUser] = useState([]);
  const [leave, setLeave] = useState({
    leave_image: {
      src: "default.png",
      file: null,
      old: "",
    },
    leave_code: "",
    leave_name: "",
    classgroup_code: "",
    owner_class: "",
    subject_code: "",
    leave_start: "",
    leave_end: "",
    leave_type: "",
    leave_reason: "",
    leave_approve: "Waiting",
    addby: "",
    adddate: "",
    mindate: time_controller.reformatToDate(new Date()),
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    setUser(user_session);

    const leave_data = await leave_model.getLeaveByCode({
      leave_code: code.params.code,
    });
    let leave_form = {};
    leave_form = leave_data.data[0];
    leave_form.leave_image = {
      src: "default.png",
      file: null,
      old: leave_data.data[0].leave_image,
    };

    setLeave(leave_form);
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await leave_model.updateLeaveBy({
        leave_code: leave.leave_code,
        leave_image: leave.leave_image.old,
        classgroup_code: leave.classgroup_code,
        owner_class: leave.owner_class,
        leave_start: time_controller.reformatToDate(leave.leave_start),
        leave_end: time_controller.reformatToDate(leave.leave_end),
        leave_type: leave.leave_type,
        leave_approve_reason: leave.leave_approve_reason,
        leave_reason: leave.leave_reason,
        leave_approve: leave.leave_approve,
        addby: user.user_code,
        adddate: time_controller.reformatToDate(new Date()),
        updateby: user.user_code,
        lastupdate: time_controller.reformatToDate(new Date()),
      });

      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        history.push("/leave-form");
      } else {
        Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (leave.leave_type === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "Please Check Your leave type ",
        icon: "warning",
      });
      return false;
    } else if (leave.leave_reason === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "Please Check Your reason",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };
  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setLeave({ ...leave, [name]: value });
  };

  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">รายละเอียดใบคำร้อง</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="6">
                <CContainer>
                  {/* Content */}
                  <br />
                  <CRow>
                    <CCol md="6">
                      <CLabel>กลุ่มเรียน</CLabel>
                      <CInput
                        name="classgroup_id"
                        value={leave.classgroup_id}
                        readOnly
                      />
                    </CCol>
                    <CCol md="6">
                      <CLabel>รายวิชา</CLabel>
                      <CInput
                        name="subject_name"
                        value={leave.subject_name}
                        readOnly
                      />
                    </CCol>

                    <CCol lg="6">
                      <br />
                      <CLabel>อาจารย์ประจำวิชา</CLabel>
                      <CInput
                        value={leave.owner_fullname}
                        name="owner_fullname"
                        readOnly
                      />
                    </CCol>
                  </CRow>
                  <br />
                  <CRow>
                    <CCol lg="6">
                      <br />
                      <CLabel>ชื่อผู้ยื่น</CLabel>
                      <CInput
                        value={leave.user_fullname}
                        name="user_fullname"
                        readOnly
                      />
                    </CCol>
                    <CCol lg="6">
                      <br />
                      <CLabel>ประเภทการลา</CLabel>
                      <CInput
                        value={
                          leave.leave_type === "on_leave" ? "ลากิจ" : "ลาป่วย"
                        }
                        name="leave_type"
                        readOnly
                      />
                    </CCol>

                    {/* กำหนดการ */}
                    <CCol md="6">
                      <br />
                      <CFormGroup>
                        <CLabel>วันที่ลา</CLabel>
                        <CInput
                          value={dayjs(leave.leave_start).locale("th").format("DD MMMM YYYY")}
                          name="leave_start"
                          readOnly
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol md="6">
                      <br />
                      <CFormGroup>
                        <CLabel>วันที่สิ้นสุดลา</CLabel>
                        <CInput
                          value={dayjs(leave.leave_end).locale("th").format("DD MMMM YYYY")}
                          name="leave_end"
                          readOnly
                        />
                      </CFormGroup>
                    </CCol>

                    <CCol md="12">
                      <br />
                      <CLabel>เหตุผลการลา</CLabel>
                      <textarea
                        class="form-control"
                        rows="4"
                        value={leave.leave_reason}
                        name="leave_reason"
                        readOnly
                      ></textarea>
                    </CCol>
                  </CRow>
                  <br />
                </CContainer>
              </CCol>

              <CCol md="6">
                <CRow>
                  <CCol md="12">
                    <CLabel>หลักฐานการยื่น</CLabel>
                    <div className="text-center">
                      <br />
                      <CImg
                        name="logo"
                        style={{ width: "350px" }}
                        src={
                          leave.leave_image.file !== null
                            ? leave.leave_image.src
                            : leave.leave_image.old !== ""
                            ? leave.leave_image.old
                            : leave.leave_image.src
                        }
                      />
                      <br />
                    </div>
                  </CCol>
                  <CCol md="12"></CCol>
                </CRow>
              </CCol>
            </CRow>
            <CRow>
              <CContainer>
                <CCol md="12">
                  <br />
                  <hr />
                  <CLabel>ยืนยันสถานะ</CLabel>
                  <tbody>
                    <CCol>
                      <input
                        type="radio"
                        name="leave_approve"
                        value="Accept"
                        checked={leave.leave_approve === "Accept"}
                        onChange={(e) => _changeFrom(e)}
                      />{" "}
                      อนุมัติ
                    </CCol>

                    <CCol>
                      <input
                        type="radio"
                        name="leave_approve"
                        value="NotAccept"
                        checked={leave.leave_approve === "NotAccept"}
                        onChange={(e) => _changeFrom(e)}
                      />{" "}
                      ไม่อนุมัติ
                    </CCol>
                  </tbody>
                </CCol>

                {leave.leave_approve === "NotAccept" ? (
                  <CCol md="12">
                    <br />
                    <CLabel>เหตุผลที่ไม่อนุญาติ</CLabel>
                    <textarea
                      class="form-control"
                      rows="4"
                      name="leave_approve_reason"
                      value={leave.leave_approve_reason}
                      onChange={(e) => _changeFrom(e)}
                    ></textarea>
                  </CCol>
                ) : (
                  ""
                )}
              </CContainer>
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
            <Link to="/leave-form">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
      </div>
    </div>
  );
}
