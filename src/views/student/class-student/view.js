import React, { useEffect, useState } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
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
      user_uid: user_session.user_uid,
    });

    let classgroup_arr = classgroup_data.data.filter(
      (data) => data.classgroup_status === "Activate"
    );
    setClassgroup(classgroup_arr);
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">
          กลุ่มเรียน
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
                title: "เมนู",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];

                  row_accessible.push(
                    <Link
                      key="news"
                      to={`/class-student/news/${cell.classgroup_code}`}
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
                      key="detail"
                      to={`/class-student/detail/${cell.user_uid}-${cell.classgroup_table_score}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon
                          icon={faCheck}
                          size="5s"
                          color="white"
                        />{" "}
                        ข้อมูล
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
    </div>
  );
}
