import React, { useState, useEffect } from "react";
import GLOBAL from "../../../GLOBAL";
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
} from "@coreui/react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Select } from "../../../component/revel-strap";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheck,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Loading } from "../../../component/revel-strap";
import { TimeController } from "../../../controller";
import SubjectModel from "../../../models/SubjectModel"
import ClassgroupModel from "../../../models/ClassgroupModel"
import UserModel from "../../../models/UserModel"

const user_model = new UserModel();
const classgroup_model = new ClassgroupModel();
const subject_model = new SubjectModel();
const time_controller = new TimeController();


export default function Update() {
  let history = useHistory();
  const [showloading, setShowLoading] = useState(true);
  let code = useRouteMatch("/class-group/update/:code"); 
  const [user, setUser] = useState([]);
  const [subject, setSubject] = useState([]);
  const [classgroup, setClassgroup] = useState([])
  const [classroom, setClassroom] = useState({
    classgroup_code: "",
    classgroup_id: "",
    classgroup_number: "",
    subject_code: "",
    user_code: "",
    addby: ""
  })
 
  useEffect(() => {
    fetchData();
  }, []);
  //  console.log("classroom",classroom);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    })

    if (class_group.require === false) {
      Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", "", "error");
      this.props.history.push("/class-group");
    } else if (class_group.data.length === 0) {
      Swal.fire("ไม่พบรายการนี้ในระบบ !", "", "warning");
      this.props.history.push("/classgroup-group");
    } else { 
      await setClassroom(class_group.data[0]);
    }

    const user_data = await user_model.getUserBy({
      user_position_code: "UP001"
    })
    let user_form = user_data.data;
    let select_user = [];
    for (let i = 0; i < user_form.length; i++) {
      select_user.push({
        value: user_form[i].user_code,
        label: user_form[i].user_full_name,
      });
    }
    setUser(select_user)


    
    const subject_data = await subject_model.getSubjectBy({});
    let subject_form = subject_data.data;
    let select_subject = [];
    for (let i = 0; i < subject_form.length; i++) {
      select_subject.push({
        value: subject_form[i].subject_code,
        label: "[ " + subject_form[i].subject_code + " ] " + subject_form[i].subject_name_th,
      });
    }
    setSubject(select_subject);
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {

      let query_result = await classgroup_model.insertClassgroup({
        classgroup_code: classroom.classgroup_code,
        classgroup_id: classroom.classgroup_id,
        classgroup_number: classroom.classgroup_number,
        subject_code: classroom.subject_code,
        user_code: classroom.user_code,
        addby: classroom.user_code,
        adddate: time_controller.reformatToDate(new Date()),
      }); 
      if (query_result.require) {
        Swal.fire("Save success!!", "", "success");
        history.push("/class-group");
      } else {
        Swal.fire("Sorry, Someting worng !", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (classroom.subject_code === "") {
      Swal.fire({
        title: "Warning!",
        text: "Please Check Your subject_code ",
        icon: "warning",
      });
      return false;
    } else
      if (classroom.user_code === "") {
        Swal.fire({
          title: "Warning!",
          text: "Please Check Your user_code",
          icon: "warning",
        });
        return false;
      } else {
        return true;
      }
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    let new_data = { ...classroom };
    new_data[name] = value;
    setClassroom(new_data);
  };


  function _onDelete(data) { 
    Swal.fire({
      title: "Are you sure ?",
      text: "Confirm to delete " + data.classgroup_code,
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setShowLoading(true);
        classgroup_model
          .deleteClassgroupByCode({ classgroup_code: data.classgroup_code })
          .then((res) => {
            if (res.require) {
              setShowLoading(false);
              Swal.fire("Success Deleted!", "", "success");
              window.location.reload();
            } else {
              setShowLoading(false);
              Swal.fire("Sorry, Someting worng !", "", "error");
            }
          });
      }
    });
  }

  
  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">
            กลุ่มเรียน / Class group
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol >
                <CRow>
                  <CCol md="3">
                    <CLabel>รหัสวิชา <font color="#F00">
                      <b>*</b>
                    </font></CLabel>
                    <Select
                      options={subject}
                      value={classroom.subject_code}
                      onChange={(e) =>
                        setClassroom({
                          ...classroom,
                          [`subject_code`]: e,
                        })
                      }
                      disabled
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        รหัสกลุ่มเรียน
                        {" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <CInput
                        type="text"
                        name="classgroup_id"
                        value={classroom.classgroup_id}
                        onChange={(e) => _changeFrom(e)}
                        disabled
                      />

                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        ผู้รับผิดชอบ
                        {" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <Select
                        options={user}
                        value={classroom.user_code}
                        onChange={(e) =>
                          setClassroom({
                            ...classroom,
                            [`user_code`]: e,
                          })
                        }
                        disabled
                      />

                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        ห้องเรียน
                        {" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <CInput
                        type="text"
                        name="classgroup_number"
                        value={classroom.classgroup_number}
                        onChange={(e) => _changeFrom(e)} 
                        disabled
                      />
                      <p className="text-muted">Example :ห้อง 18311</p>
                    </CFormGroup>
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
            <Link to="/class-group">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
        <CCard>
        <CCardHeader className="header-t-red">
        รายชื่อ / Name list
          <Link to={`/class-group/insert`} className="btn btn-success float-right">
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มรายชื่อด้วยไฟล์ Excel
          </Link>
          <Link to={`/class-group/insert`} className="btn btn-primary float-right">
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มรายชื่อด้วยตัวเอง
          </Link>
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={classgroup}
            dataTotal={classgroup}
            rowKey=""
            columns={[
              {
                title: "รหัสกลุ่มเรียน",
                dataIndex: "classgroup_code",
                filterAble: true,
                ellipsis: true,
                width: 120,
                align: "center",
              },
              {
                title: "รหัสวิชา",
                dataIndex: "subject_code",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              }, 
              {
                title: "#",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];
                  row_accessible.push(
                    <Link
                      key="update"
                      to={`/class-group/update/${cell.classgroup_code}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon
                          icon={faEdit}
                          size="5s"
                          color="white"
                        />
                      </button>
                    </Link>
                  );
                  row_accessible.push(
                    <button
                      type="button"
                      className={"btn btn-danger"}
                      onClick={() => _onDelete(cell)}
                    >
                      <FontAwesomeIcon
                        icon={faWindowClose}
                        size="5s"
                        color="white"
                      />
                    </button>
                  );

                  return row_accessible;
                },
                width: 120,
              },
            ]}
          />
        </CCardBody>
      </CCard>
      </div>
    </div>
  );
}
