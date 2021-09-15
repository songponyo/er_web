import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CButton,
  CImg,
} from "@coreui/react";
import Swal from "sweetalert2";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Select, DatePicker } from "../../../component/revel-strap";
import { Uploadimage, TimeController } from "../../../controller";
import ClassgroupModel from "../../../models/ClassgroupModel";
import LeaveModel from "../../../models/LeaveModel";

const upload_contoller = new Uploadimage();
const leave_model = new LeaveModel();
const classgroup_model = new ClassgroupModel();
const time_controller = new TimeController();

export default function Detail() {
  let history = useHistory();

  let code = useRouteMatch("/leave-student/detail/:code");
  const [user, setUser] = useState([]);
  const [classselect, setClassselect] = useState([]);
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

  const fetchData = async () => {
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

    const classgroup_data = await classgroup_model.getClassgroupByMycourse({
      user_code: user_session.user_code,
    });
    // setClassgroup(classgroup_data.data);

    let class_form = classgroup_data.data;
    let select_class = [];
    for (let i = 0; i < class_form.length; i++) {
      select_class.push({
        value: class_form[i].classgroup_code,
        label: class_form[i].subject_fullname,
      });
    }
    setClassselect(select_class);
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setLeave({ ...leave, [name]: value });
  };

  const _handleImageChange = (img_name, e) => {
    if (e.target.files.length) {
      let file = new File([e.target.files[0]], e.target.files[0].name, {
        type: e.target.files[0].type,
      });
      if (file !== undefined) {
        let reader = new FileReader();
        reader.onloadend = () => {
          let new_material = { ...leave };
          new_material[img_name] = {
            src: reader.result,
            file: file,
            old: new_material[img_name].old,
          };
          setLeave(new_material);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">
            รายวิชาที่ต้องการลา
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="6">
                <CRow>
                  <CCol md="12">
                    <CFormGroup>
                      <CLabel>กลุ่มเรียน</CLabel>
                      <Select
                        options={classselect}
                        value={leave.classgroup_code}
                        onChange={(e) =>
                          setLeave({
                            ...leave,
                            [`classgroup_code`]: e,
                          })
                        }
                      />
                    </CFormGroup>
                  </CCol>

                  {/* ประเภทการลา */}
                  <CCol md="12">
                    <br />
                    <CLabel>ประเภทการลา</CLabel>
                    <tbody>
                      <CCol>
                        <input
                          type="radio"
                          name="leave_type"
                          value="on_leave"
                          checked={leave.leave_type === "on_leave"}
                          readOnly
                        />{" "}
                        ลากิจ
                      </CCol>
                      <CCol>
                        <input
                          type="radio"
                          name="leave_type"
                          value="sick_leave"
                          checked={leave.leave_type === "sick_leave"}
                          onChange={(e) => _changeFrom(e)}
                        />{" "}
                        ลาป่วย
                      </CCol>
                    </tbody>
                  </CCol>

                  {/* กำหนดการ */}
                  <CCol md="6">
                    <br />
                    <CFormGroup>
                      <CLabel>วันที่ลา</CLabel>
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        value={leave.leave_start}
                        onChange={(e) =>
                          setLeave({
                            ...leave,
                            [`leave_start`]: e,
                          })
                        }
                        minDate={new Date(leave.leave_start)}
                      />
                      <p className="text-muted">Example : 01/01/2020.</p>
                    </CFormGroup>
                  </CCol>
                  <CCol md="6">
                    <br />
                    <CFormGroup>
                      <CLabel>วันที่สิ้นสุดลา</CLabel>
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        value={leave.leave_end}
                        onChange={(e) =>
                          setLeave({
                            ...leave,
                            [`leave_end`]: e,
                          })
                        }
                        minDate={new Date(leave.leave_start)}
                      />
                      <p className="text-muted">Example : 01/01/2020.</p>
                    </CFormGroup>
                  </CCol>

                  {/* เหตุผลการลา */}
                  <CCol md="12">
                    <br />
                    <CFormGroup>
                      <CLabel>เหตุผลการลา</CLabel>
                      <br />
                      <textarea
                        style={{ padding: "1%" }}
                        name="leave_reason"
                        value={leave.leave_reason}
                        rows="5"
                        cols="70"
                        onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>
              <CCol md="6">
                <CLabel>อัพโหลดภาพ </CLabel>
                <br />
                <CImg
                  name="logo"
                  style={{ width: "350px", alignSelf: "center" }}
                  src={
                    leave.leave_image.old !== ""
                      ? leave.leave_image.old
                      : leave.leave_image.src
                  }
                  alt="Logo"
                />
                <br />
                <br />
                <CInput
                  type="file"
                  name="leave_image"
                  style={{ border: "none" }}
                  accept="image/png, image/jpeg"
                  onChange={(e) => _handleImageChange("leave_image", e)}
                />
              </CCol>
            </CRow>
          </CCardBody>

          <CCardFooter>
            <Link to="/leave-student">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
      </div>
    </div>
  );
}
