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
import { Card, CardBody, CardHeader, Nav } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheck,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table, Loading } from "../../../component/revel-strap"; 
import SubjectModel from "../../../models/SubjectModel";

const subject_model = new SubjectModel();

export default function View() {
  const [showloading, setShowLoading] = useState(true);
  const [subject, setSubject] = useState([]);
  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const subject_data = await subject_model.getSubjectBy({});
    console.log("subject_data",subject_data);
    setSubject(subject_data.data);
  }

  function _onDelete(data) {
    Swal.fire({
      title: "Are you sure ?",
      text: "Confirm to delete " + data.subject_name,
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setShowLoading(true);
        subject_model
          .deleteSubjectByCode({
            subject_code: data.subject_code,
          })
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
      <CCard>
        <CCardHeader className="header-t-red">
          รายวิชา / Course
          <Link
            to={`/course/insert`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มรายวิชา
          </Link>
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={subject}
            dataTotal={subject}
            rowKey=""
            columns={[
              {
                title: "รหัสวิชา",
                dataIndex: "subject_code",
                filterAble: true,
                ellipsis: true,
                width: 120,
                align: "center",
              },
              {
                title: "ชื่อวิชาภาษาไทย",
                dataIndex: "subject_name_th",
                filterAble: true,
                ellipsis: true,
              },
              {
                title: "ชื่อวิชาภาษาอังกฤษ",
                dataIndex: "subject_name_en",
                filterAble: true,
                ellipsis: true,
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
                      to={`/course/update/${cell.subject_code}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-warning">
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
  );
}
