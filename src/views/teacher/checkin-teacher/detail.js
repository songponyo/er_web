import React, { useState, useEffect } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "../../../component/revel-strap";
import CheckinModel from "../../../models/CheckinModel";
// import { Modal } from "antd";
import Modal from "react-bootstrap/Modal";
import Maps from "../../../controller/Maps";
import dayjs from "dayjs";

const checkin_model = new CheckinModel();

// const utc = require('dayjs/plugin/utc');
// const timezone = require('dayjs/plugin/timezone');
// dayjs.extend(utc);
// dayjs.extend(timezone); 
// dayjs.tz.setDefault('Asia/Hong_Kong');


export default function Detail() {
  let code = useRouteMatch("/checkin-teacher/detail/:code");
  const [classgroup, setClassgroup] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    // const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    let code_form = code.params.code;
    var n = code_form.split("-");
    const qrcode_data = await checkin_model.getCheckinByCode({
      classgroup_code: n[1],
      owner: n[0],
    });

    setClassgroup(qrcode_data.data);
  }

  function showmodal() {
    setShow(true);
  }

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          รายชื่อเข้าเรียน
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={classgroup}
            dataTotal={classgroup}
            rowKey=""
            columns={[
              {
                title: "รหัสประจำตัว",
                dataIndex: "user_uid",
                filterAble: true,
                ellipsis: true,
                width: 120,
                align: "center",
              },
              {
                title: "ชื่อ",
                dataIndex: "owner_fullname",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "เวลาเข้าเรียน",
                dataIndex: "checkin_time",
                render: (cell) => {
                  let time = dayjs.tz(cell).format("HH:mm"); 
                  return time;
                },
                filterAble: true,
                align: "center",
                width: 120,
              },
              {
                title: "สถานะเรียน",
                dataIndex: "checkin_status",
                render: (cell) => {
                  if (cell === "Active") {
                    return <span className="text-success">เข้าเรียน</span>;
                  } else {
                    return cell == "Inactive" ? (
                      <span className="text-danger">สาย</span>
                    ) : (
                      <span className="text-danger">ลา</span>
                    );
                  }
                },
                filters: [
                  { text: "เข้าเรียน", value: "Active" },
                  { text: "สาย", value: "Inactive" },
                ],
                align: "center",
                width: 120,
              },
              {
                title: "จัดการ",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];
                  row_accessible.push(
                    <button
                      type="button"
                      className="btn btn-success"
                      // onClick={showModal}
                      onClick={() => showmodal()}
                    >
                      <FontAwesomeIcon icon={faMap} size="5s" color="white" />{" "}
                      แผนที่
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
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title>จุดเช็คอิน</Modal.Title>
        </Modal.Header>
        <div>
          <Maps value={classgroup} />
        </div>
      </Modal>
    </>
  );
}
