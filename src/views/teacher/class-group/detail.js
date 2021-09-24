import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ClassgroupModel from "../../../models/ClassgroupModel";
import ScoreModel from "../../../models/ScoreModel";
const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();

export default function Detail() {
  // let history = useHistory();
  let code = useRouteMatch("/class-group/detail/:code");
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    let class_code = code.params.code;
    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: class_code,
    });
    const score_group = await score_model.getScoreByCode({
      table_name: class_group.data[0].classgroup_table_score,
    });

    let score_info = {};
    score_info = score_group.data;
    score_info.table_name = class_group.data[0].classgroup_table_score;
    setClassgroup(score_info);
  }

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          {" "}
          รายชื่อ / Name list
          <Link
            to={`/class-group/adduser`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มรายชื่อ
          </Link>
        </CCardHeader>
        <CCardBody>
          <Table
            dataSource={classgroup}
            scroll={{ x: 1500, y: 450 }}
            columns={[
              {
                title: "ชื่อ",
                width: 150,
                dataIndex: "user_full_name",
                key: "user_full_name",
                fixed: "left",
              },
              {
                title: "รหัสนักศึกษา",
                width: 130,
                dataIndex: "user_uid",
                key: "user_uid",
                fixed: "left",
              },
              {
                title: "คะแนนช่องที่ 1",
                dataIndex: "score_one",
                key: "1",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 2",
                dataIndex: "score_two",
                key: "2",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 3",
                dataIndex: "score_three",
                key: "3",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 4",
                dataIndex: "score_four",
                key: "4",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 5",
                dataIndex: "score_five",
                key: "5",
                width: 150,
              },
              {
                title: "คะแนนช่องที่ 6",
                dataIndex: "score_sixt",
                key: "6",
                width: 150,
              },
              {
                title: "เมนูจัดการ",
                key: "operation",
                fixed: "right",
                width: 100,
                render: (cell) => {
                  const row_accessible = [];
                  row_accessible.push(
                    <Link
                      key="score"
                      to={`/class-group/score/${cell.user_uid}-${classgroup.table_name}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon
                          icon={faEdit}
                          size="5s"
                          color="white"
                        />
                        แก้ไข
                      </button>
                    </Link>
                  );
                  return row_accessible;
                },
                width: 120,
              },
            ]}
          />
        </CCardBody>
      </CCard>
    </>
  );
}
