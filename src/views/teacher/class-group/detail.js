import React, { useState, useEffect } from "react";
// import ExcelPage from "../../../component/excelPage";
import { Table } from "antd";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  // CCardFooter,
  // CCol,
  // CRow,
  // CFormGroup,
  // CLabel,
  // CInput,
  // CButton,
} from "@coreui/react";
// import Swal from "sweetalert2";
// import { Modal } from "react-bootstrap"; 
import {
  // Link,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheck,
  faSearch,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons"; 
// import { TimeController } from "../../../controller";
import ClassgroupModel from "../../../models/ClassgroupModel";
import ScoreModel from "../../../models/ScoreModel";
// import UserModel from "../../../models/UserModel";

// const user_model = new UserModel();
const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();
const { Column, ColumnGroup } = Table;

export default function Detail() {
  // let history = useHistory();
  // const [showloading, setShowLoading] = useState(true);
  let code = useRouteMatch("/class-group/detail/:code");
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    });

    const score_group = await score_model.getScoreByCode({
      table_name: class_group.data[0].classgroup_table_score,
    });
    setClassgroup(score_group.data);
  }

  async function _handleSubmit() {}

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    let new_data = { ...classgroup };
    new_data[name] = value;
    setClassgroup(new_data);
  };

 

  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i,
      name: `User ${i}`,
      age: 312323223-4,
      address: `10`,
    });
  }

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red"> รายชื่อ / Name list
        <Link
            to={`/class-group/insert`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i>{" "}
            เพิ่มรายชื่อ
          </Link>
        </CCardHeader>
        <CCardBody>
          <Table
            columns={[
              {
                title: "ชื่อ",
                width: 100,
                dataIndex: "name",
                key: "name",
                fixed: "left",
              },
              {
                title: "รหัสนักศึกษา",
                width: 120,
                dataIndex: "age",
                key: "user_id",
                fixed: "left",
              },
              {
                title: "คะแนนช่องที่ 1",
                dataIndex: "address",
                key: "1",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 2",
                dataIndex: "address",
                key: "2",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 3",
                dataIndex: "address",
                key: "3",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 4",
                dataIndex: "address",
                key: "4",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 5",
                dataIndex: "address",
                key: "5",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 6",
                dataIndex: "address",
                key: "6",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 7",
                dataIndex: "address",
                key: "7",
                width: 150,
              },
              { title: "คะแนนช่องที่ 8", dataIndex: "address", key: "8" },
              {
                title: "เมนูจัดการ",
                key: "operation",
                fixed: "right",
                width: 100,
                render: (cell) => {
                  const row_accessible = [];
                  row_accessible.push(
                    <Link
                      key="update"
                      to={`/class-group/update/${cell.classgroup_code}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-primary">
                          แก้ไข
                      </button>
                    </Link>
                  );
                  return row_accessible;
                },
                width: 120,
              },
            ]}
            dataSource={data}
            scroll={{ x: 1500, y: 300 }}
          /> 
        </CCardBody>
      </CCard>
    </>
  );
}
