import React, { Component, useEffect, useState } from "react";
import GLOBAL from "../../../GLOBAL";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWindowClose,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table, Loading } from "../../../component/revel-strap";
import dayjs from "dayjs";
import ClassgroupModel from "../../../models/ClassgroupModel";

const classgroup_model = new ClassgroupModel();

export default function View() {
  const [showloading, setShowLoading] = useState(true);
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const classgroup_data = await classgroup_model.getClassgroupBy({});
    setClassgroup(classgroup_data.data);
  }

  function _onDelete(data) {
    Swal.fire({
      title: "ยืนยันที่จะลบรายการนี้หรือไม่",
      text:
        "กลุ่มเรียน " + data.classgroup_id + " วิชา " + data.subject_fullname,
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setShowLoading(true);
        classgroup_model
          .deleteClassgroupByCode({
            classgroup_code: data.classgroup_code,
            table_name: data.classgroup_table_score,
          })
          .then((res) => {
            if (res.require) {
              setShowLoading(false);
              Swal.fire("ลบรายการ เรียบร้อย", "", "success");
              window.location.reload();
            } else {
              setShowLoading(false);
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
            classgroup_status: "Deactivate",
          })
          .then((res) => {
            if (res.require) {
              Swal.fire("ปิดการใช้งานเรียบร้อย", "", "success");
              window.location.reload();
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
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={classgroup}
            dataTotal={classgroup}
            columns={[
              {
                title: "กลุ่มเรียน",
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
                width: 300,
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
                title: "สถานะ",
                dataIndex: "classgroup_status",
                render: (cell) => {
                  if (cell === "Waiting") {
                    return <p>รออนุมัติ</p>;
                  } else {
                    return cell !== "Deactivate" ? (
                      <span className="text-success">ใช้งาน</span>
                    ) : (
                      <span className="text-danger">ปิดใช้งาน</span>
                    );
                  }
                },
                filters: [
                  { text: "ใช้งาน", value: "Activate" },
                  { text: "ปิดใช้งาน", value: "Deactivate" },
                ],
                ellipsis: true,
                width: 100,
                align: "center",
              },
              {
                title: "เมนู",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];
                  row_accessible.push(
                    <Link
                      key="update"
                      to={`/all-class/update/${cell.classgroup_code}`}
                      title="สมัครสมาชิก"
                    >
                      <button type="button" className="btn btn-warning">
                        <FontAwesomeIcon
                          icon={faAddressCard}
                          size="5s"
                          color="white"
                        />{" "}
                        แก้ไข
                      </button>
                    </Link>
                  );

                  // row_accessible.push(
                  //   <button
                  //     type="button"
                  //     className={"btn btn-secondary"}
                  //     onClick={() => _onInActive(cell)}
                  //   >
                  //     <FontAwesomeIcon
                  //       icon={faWindowClose}
                  //       size="5s"
                  //       color="white"
                  //     />{" "}
                  //     ปิดการใช้งาน
                  //   </button>
                  // );

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
                width: 300,
              },
            ]}
          />
        </CCardBody>
      </CCard>
    </div>
  );
}
