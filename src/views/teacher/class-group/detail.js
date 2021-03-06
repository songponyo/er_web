import React, { useState, useEffect } from "react";
import { Empty } from "antd";
import * as XLSX from "xlsx";
import { Table } from "antd";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CButton,
  CImg,
} from "@coreui/react";
import { useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import ClassgroupModel from "../../../models/ClassgroupModel";
import ScoreModel from "../../../models/ScoreModel";
import TopicModel from "../../../models/TopicModel";

const topic_model = new TopicModel();
const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();

export default function Detail() {
  let code = useRouteMatch("/class-group/detail/:code");
  const [classgroup, setClassgroup] = useState([]);
  const [topics, setTopics] = useState([]);
  const [score, setScore] = useState([]);
  const [files, setFiles] = useState({ data: [], score_user: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [cols, setCols] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [switchbox, setSwitchbox] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (classgroup.length !== 0) {
      let arr_score = [];
      let comp = [];
      let arr_sc = [];
      classgroup.map((data, idx) => {
        arr_score.push({
          user_uid: data.user_uid,
          user_full_name: data.user_full_name,
          leave_maxcount: data.leave_maxcount || 0,
        });

        let sc = score
          .filter((scores) => scores.user_uid === data.user_uid)
          .map((tc) => {
            // console.log("gg");
            return tc.score_value;
          });
        // console.log("sc",sc);
        // comp[idx] = { ...arr_score[idx], ...sc };
        arr_sc[idx] = sc;
        // console.log("arr_sc", arr_sc);
        comp[idx] = { ...arr_score[idx] };
      });
      setFiles({ data: comp, score_user: arr_sc });

      // ?????????????????????????????????????????????????????????
      let arr_coluns = [];
      topics.map((data) => {
        arr_coluns.push({
          title: (
            <div align="center">
              {data.topic_name}
              <br />({data.max_score})
            </div>
          ),
          dataIndex: "",
          filterAble: true,
          ellipsis: true,
          width: 50,
          render: (cell) => {
            const row_accessible = [];
            score
              .filter(
                (items) =>
                  items.topic_code === data.topic_code &&
                  items.user_uid === cell.user_uid
              )
              .map((item) => {
                row_accessible.push(<div>{item.score_value}</div>);
              });

            return row_accessible;
          },
          // align: "center",
        });
      });
      let new_columns = columns;
      new_columns.splice(3, 0, ...arr_coluns);
      setCols(new_columns);
    }
  }, [score]);

  async function fetchData() {
    let class_code = code.params.code;
    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: class_code,
    });
    const topic_data = await topic_model.getTopicByClassCode({
      classgroup_code: class_code,
    });
    setTopics(topic_data.data);

    const score_group = await score_model.getScoreByCode({
      table_name: class_group.data[0].classgroup_table_score,
    });
    let sg_arr = [];
    score_group.data.map((sg_id, idx) => {
      sg_arr[idx] = { ...sg_id, id: idx + 1 };
    });
    let score_info = {};
    score_info = sg_arr;
    score_info.table_name = class_group.data[0].classgroup_table_score;
    score_info.leave_maxcount = class_group.data[0].leave_maxcount;
    setClassgroup(score_info);

    const score_user = await score_model.getScoreByGroup({
      classgroup_code: class_code,
      table_name: class_group.data[0].classgroup_table_score,
    });
    setScore(score_user.data);

    setIsLoading(true);
  }

  const exportToCSV = () => {
    let Heading = [
      [
        "????????????????????????????????????",
        "????????????-?????????????????????",
        "???????????????????????????????????????????????? " + "(" + classgroup.leave_maxcount + ")",
      ],
    ];
    topics.map((data) => {
      Heading[0].push(data.topic_name + "(" + data.max_score + ")");
    });
    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);

    XLSX.utils.sheet_add_aoa(ws, Heading);

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, files.data, {
      origin: "A2",
      skipHeader: true,
    });

    XLSX.utils.sheet_add_json(ws, files.score_user, {
      origin: "D2",
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "?????????????????????????????????????????????.xlsx");
  };

  function _onDelete(data) {
    Swal.fire({
      title: "??????????????????",
      text: "????????????????????????????????????????????????????????????????????????????????????",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        score_model
          .deleteScoreByCode({
            user_uid: data,
            table_name: classgroup.table_name,
            classgroup_code: code.params.code,
          })
          .then((res) => {
            if (res.require) {
              Swal.fire("???????????????????????? ???????????????????????????", "", "success");
              window.location.reload();
            } else {
              Swal.fire("?????????????????? ???????????????????????????????????????????????????", "", "error");
            }
          });
      }
    });
  }

  const addCheckbox = (cell) => {
    // let arr_row = [];
    let arr_old = selectedRowKeys;
    let check_duplicate = true;
    arr_old
      .filter((item) => item.user_uid === cell.user_uid)
      .map(() => {
        check_duplicate = false;
      });
    if (check_duplicate) {
      arr_old.push(cell);
      setSelectedRowKeys(arr_old);
    } else {
      arr_old.filter((person) => person.user_uid != cell.user_id);
    }
    setSwitchbox(true);
  }; 
  
  const columns = [
    // {
    //   title: <input type="checkbox" onClick={(e) => addCheckbox("head")} />,
    //   dataIndex: "",
    //   filterAble: true,
    //   ellipsis: true,
    //   width: 10,
    //   align: "center",
    //   render: (cell) => {
    //     return (
    //       <input
    //         type="checkbox"
    //         value={selectedRowKeys.user_uid}
    //         onClick={() => addCheckbox(cell)}
    //       />
    //     );
    //   },
    // },
    {
      title: <div align="center">No.</div>,
      dataIndex: "id",
      filterAble: true,
      ellipsis: true,
      width: 20,
      align: "center",
    },
    {
      title: <div align="center">?????????????????????????????????????????????</div>,
      dataIndex: "user_uid",
      ellipsis: true,
      width: 50,
      // align: "center",
    },
    {
      title: <div align="center">???????????? - ?????????????????????</div>,
      dataIndex: "user_full_name",
      filterAble: true,
      ellipsis: true,
      width: 70,
      // align: "center",
    },
    {
      title: <div align="center">????????????</div>,
      dataIndex: "",
      align: "right",
      render: (cell) => {
        const row_accessible = [];

        row_accessible.push(
          <Link
            key="score"
            to={`/class-group/score/${cell.user_uid}-${classgroup.table_name}`}
            title="?????????????????????????????????"
          >
            <button type="button" className="btn btn-primary">
              <FontAwesomeIcon icon={faEdit} size="5s" color="white" />
              ???????????????
            </button>
          </Link>
        );
        row_accessible.push(
          <CButton
            type="button"
            className="btn btn-danger"
            onClick={() => _onDelete(cell.user_uid)}
          >
            <FontAwesomeIcon icon={faTrash} size="5s" color="white" /> ????????????????????????
          </CButton>
        );
        return row_accessible;
      },
      width: 80,
    },
  ];

  return (
    <>
      {!isLoading ? (
        <div align="center">
          <CImg src="https://cdn.dribbble.com/users/108183/screenshots/4543219/loader_backinout.gif" />
        </div>
      ) : (
        <CCard>
          <CCardHeader className="header-t-red">
            ?????????????????????
            <Link
              to={`/class-group/excel/${code.params.code}`}
              className="btn btn-success float-right"
            >
              <i className="fa fa-plus" aria-hidden="true"></i>{" "}
              ??????????????????????????????????????????????????? Excel
            </Link>
            {/* <Link
            to={`/class-group/adduser`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> ????????????????????????????????????
          </Link> */}
          </CCardHeader>
          {score.length !== 0 ? (
            <CCardBody>
              {switchbox !== false ? (
                <CButton type="button" color="danger">
                  {" "}
                  ????????????????????????????????????????????????{" "}
                </CButton>
              ) : null}

              <Table
                bordered
                dataSource={classgroup}
                // dataTotal={classgroup}

                align="left"
                columns={cols}
                size="small"
              />
            </CCardBody>
          ) : (
            <CCardBody>
              <Empty></Empty>
            </CCardBody>
          )}

          <CCardFooter>
            <CButton color="success" onClick={() => exportToCSV()}>
              Export .CSV
            </CButton>
            <Link to={`/class-group`}>
              <CButton type="button" color="danger">
                {" "}
                ????????????????????????{" "}
              </CButton>
            </Link>
          </CCardFooter>
        </CCard>
      )}
    </>
  );
}
