import React, { useState, useEffect } from "react";
import ExcelPage from "../../../component/excelPage";

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
import {
  faAddressBook,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, Loading } from "../../../component/revel-strap";
import { TimeController } from "../../../controller";
import ClassgroupModel from "../../../models/ClassgroupModel"
import ScoreModel from "../../../models/ScoreModel"
import UserModel from "../../../models/UserModel"
import QrcodeModel from "../../../models/QrcodeModel"

const qrcode_model = new QrcodeModel()
const user_model = new UserModel();
const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();
const time_controller = new TimeController();


export default function Detail() {
  let history = useHistory();
  const [showloading, setShowLoading] = useState(true);
  let code = useRouteMatch("/checkin-teacher/detail/:code");
  const [classgroup, setClassgroup] = useState([])


  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const qrcode_data = await qrcode_model.getQrcodeBy({
      classgroup_code: code.params.code,
    })

    setClassgroup(qrcode_data.data)

  }

  async function _handleSubmit() {
  }



  const _changeFrom = (e) => {
    const { value, name } = e.target;
    let new_data = { ...classgroup };
    new_data[name] = value;
    setClassgroup(new_data);
  };

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          รายชื่อเข้าเรียน / Name list
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
                title: "จัดการ",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];

                  row_accessible.push(
                    <Link
                      key="update"
                      to={`/checkin-teacher/qrcode/${cell.classgroup_code}`}
                      title="สร้างรายการเช็คชื่อ"
                    >
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon
                          icon={faQrcode}
                          size="5s"
                          color="white"
                        />
                      </button>
                    </Link>
                  );


                  row_accessible.push(
                    <Link
                      key="update"
                      to={`/checkin-teacher/detail/${cell.classgroup_code}`}
                      title="รายชื่อที่เข้าเรียน"
                    >
                      <button type="button" className="btn btn-success">
                        <FontAwesomeIcon
                          icon={faAddressBook}
                          size="5s"
                          color="white"
                        />
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
