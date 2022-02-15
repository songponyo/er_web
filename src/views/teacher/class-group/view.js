import React, { useEffect, useState } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faWindowClose,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { Table } from "../../../component/revel-strap";
import ClassgroupModel from "../../../models/ClassgroupModel";
const classgroup_model = new ClassgroupModel();

export default function View() {
  const [classgroup, setClassgroup] = useState([]);
 
  useEffect(() => {
    async function _fetchData() {
      const user_session = await JSON.parse(
        localStorage.getItem(`session-user`)
      );
      const classgroup_data = await classgroup_model.getClassgroupBy({
        owner: user_session.user_code,
      });

      let classgroup_arr = classgroup_data.data.filter(
        (data) => data.classsgroup_status === "Activate"
      );
      setClassgroup(classgroup_arr);
    }
    _fetchData();
  }, []);

  function _onDelete(data) {
    Swal.fire({
      title: "คุณต้องการลบรายการนี้",
      text:
        "โปรดยืนยันการกระทำ" +
        data.classgroup_id +
        "   " +
        data.subject_fullname,
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        classgroup_model
          .deleteClassgroupByCode({
            classgroup_code: data.classgroup_code,
            table_name: data.classgroup_table_score,
          })
          .then((res) => {
            if (res.require) {
              Swal.fire("ลบรายการ เรียบร้อย", "", "success");
              window.location.reload();
            } else {
              Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
            }
          });
      }
    });
  }

  function _onInActive(data) {
    Swal.fire({
      title: " ปิดการใช้งานรายการนี้หรือไม่",
      text: data.classgroup_id + "   " + data.subject_fullname,
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        classgroup_model
          .updateClassgroupByAdmin({
            classgroup_code: data.classgroup_code,
            classgroup_id: data.classgroup_id,
            classgroup_password: data.classgroup_password,
            classgroup_number: data.classgroup_number,
            classgroup_table_score: data.classgroup_table_score,
            subject_code: data.subject_code,
            user_code: data.user_code,
            classgroup_time_start: dayjs(data.classgroup_time_start).format(
              "YYYY-MM-DD H:mm:ss"
            ),
            classgroup_time_end: dayjs(data.classgroup_time_end).format(
              "YYYY-MM-DD H:mm:ss"
            ),
            addby: data.addby,
            adddate: data.adddate,
            leave_maxcount: data.leave_maxcount,
            classsgroup_status: "Deactivate",
          })
          .then((res) => {
            if (res.require) {
              Swal.fire("ปิดการใช้งานเรียบร้อย", "success").then(() =>
                window.location.reload()
              );
            } else {
              Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
            }
          });
      }
    });
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">
          กลุ่มเรียน
          <Link
            to={`/class-group/grouplist`}
            className="btn btn-success float-right"
          >
            รายวิชาทั้งหมดที่เปิดสอน
          </Link>
          <Link
            to={`/class-group/insert`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มกลุ่มเรียน
          </Link>
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={classgroup}
            dataTotal={classgroup}
            columns={[
              {
                title: "รหัสกลุ่มเรียน",
                dataIndex: "classgroup_id",
                filterAble: true,
                ellipsis: true,
                width: 120,
                align: "center",
              },
              {
                title: "รหัสวิชา",
                dataIndex: "subject_fullname",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "ผู้รับผิดชอบ",
                dataIndex: "user_fullname",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "ห้อง",
                dataIndex: "classgroup_number",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "เมนู",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];

                  row_accessible.push(
                    <Link
                      key="update"
                      to={`/class-group/detail/${cell.classgroup_code}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon
                          icon={faSearch}
                          size="5s"
                          color="white"
                        />{" "}
                        รายชื่อนักศึกษา
                      </button>
                    </Link>
                  );

                  row_accessible.push(
                    <Link
                      key="news"
                      to={`/class-group/news/${cell.classgroup_code}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-success">
                        <FontAwesomeIcon
                          icon={faSearch}
                          size="5s"
                          color="white"
                        />{" "}
                        กระดานข่าว
                      </button>
                    </Link>
                  );

                  row_accessible.push(
                    <Link
                      key="update"
                      to={`/class-group/update/${cell.classgroup_code}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-warning">
                        <FontAwesomeIcon
                          icon={faEdit}
                          size="5s"
                          color="white"
                        />{" "}
                        แก้ไข
                      </button>
                    </Link>
                  );

                  row_accessible.push(
                    <button
                      type="button"
                      className={"btn btn-danger"}
                      onClick={() => _onInActive(cell)}
                    >
                      <FontAwesomeIcon
                        icon={faWindowClose}
                        size="5s"
                        color="white"
                      />{" "}
                      ปิดการใช้งาน
                    </button>
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
                      />{" "}
                      ลบ
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
  );
}
