import React, { useEffect, useState } from "react";
import { CCard, CCardHeader, CCardBody, CRow, CCol } from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table } from "../../../component/revel-strap";
import PrefixModel from "../../../models/PrefixModel";

const prefix_model = new PrefixModel();

export default function View() {
  const [prefix, setPrefix] = useState();

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const prefix_data = await prefix_model.getPrefixBy({}); 
    setPrefix(prefix_data.data);
  }

  function _onDelete(data) {
    Swal.fire({
      title: "ลบรายวิชา?",
      text: "ยืนยันที่จะลบวิชา " + data.prefix_name + " หรือไม่",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        prefix_model
          .deletePrefixByCode({
            prefix_code: data.prefix_code,
          })
          .then((res) => {
            if (res.require) {
              Swal.fire("ลบเรียบร้อย", "", "success");
              window.location.reload();
            } else {
              Swal.fire("ขออภัย  มีบางอย่างผิดพลาด", "", "error");
            }
          });
      }
    });
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">
          คำนำหน้า
          <Link to={`/prefix/insert`} className="btn btn-success float-right">
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มข้อมูล
          </Link>
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={false}
            dataSource={prefix}
            dataTotal={prefix}
            rowKey=""
            columns={[
              {
                title: "คำนำหน้า",
                dataIndex: "prefix_name",
                filterAble: true,
                ellipsis: true,
              },
              {
                title: "เมนู",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];

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
                      ลบรายการ
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
