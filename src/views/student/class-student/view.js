import React, { Component, useEffect, useState } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table } from "../../../component/revel-strap";
import ClassgroupModel from "../../../models/ClassgroupModel";
const classgroup_model = new ClassgroupModel();

export default function View() {
  const [classgroup, setClassgroup] = useState([]); 
  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    const classgroup_data = await classgroup_model.getClassgroupByMycourse({
      user_code: user_session.user_code,
    });
    setClassgroup(classgroup_data.data); 
  }

  function _onDelete(data) {
    Swal.fire({
      title: "Are you sure ?",
      text: "Confirm to delete " + data.classgroup_code,
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) { 
        classgroup_model
          .deleteClassgroupByCode({ classgroup_code: data.classgroup_code })
          .then((res) => {
            if (res.require) { 
              Swal.fire("Success Deleted!", "", "success");
              window.location.reload();
            } else { 
              Swal.fire("Sorry, Someting worng !", "", "error");
            }
          });
      }
    });
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">
          กลุ่มเรียน / Class group
          {/* <Link to={`/class-group/insert`} className="btn btn-success float-right">
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มกลุ่มเรียน
          </Link> */}
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
                dataIndex: "classgroup_id",
                filterAble: true,
                ellipsis: true,
                width: 120,
                align: "center",
              },
              {
                title: "ชื่อวิชา",
                dataIndex: "subject_fullname",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "ผู้รับผิดชอบ",
                dataIndex: "owner_fullname",
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
                      key="detail"
                      to={`/class-student/detail/${cell.classgroup_table_score}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon
                          icon={faCheck}
                          size="5s"
                          color="white"
                        /> ข้อมูล
                      </button>
                    </Link>
                  );
                  // row_accessible.push(
                  //   <button
                  //     type="button"
                  //     className={"btn btn-danger"}
                  //     onClick={() => _onDelete(cell)}
                  //   >
                  //     <FontAwesomeIcon
                  //       icon={faWindowClose}
                  //       size="5s"
                  //       color="white"
                  //     />
                  //   </button>
                  // );

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
