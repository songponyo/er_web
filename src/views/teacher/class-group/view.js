import React, { Component, useEffect, useState } from "react";
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
  faEdit,
  faCheck,
  faWindowClose,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table, Loading } from "../../../component/revel-strap";
import ClassgroupModel from "../../../models/ClassgroupModel";
const classgroup_model = new ClassgroupModel();

export default function View() {
  const [showloading, setShowLoading] = useState(true);
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    const classgroup_data = await classgroup_model.getClassgroupBy({
      owner : user_session.user_code
    });
    setClassgroup(classgroup_data.data);
  }

  function _onDelete(data) {
    Swal.fire({
      title: "Are you sure ?",
      text:
        "Confirm to delete " +
        data.classgroup_id +
        "   " +
        data.subject_fullname,
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

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">
          กลุ่มเรียน / Class group
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
                title: "#",
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
                      key="excel"
                      to={`/class-group/excel/${cell.classgroup_code}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-success">
                        <FontAwesomeIcon
                          icon={faEdit}
                          size="5s"
                          color="white"
                        />{" "}
                        Excel
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
