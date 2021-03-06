import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CFormGroup,
  CLabel,
  CButton,
  CFormText,
  CForm,
  CImg,
} from "@coreui/react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Swal from "sweetalert2";
import { FloatingLabel, Form } from "react-bootstrap";
import { Link, useRouteMatch } from "react-router-dom";
import {
  DatePicker,
  Space,
  Switch,
  Menu,
  Dropdown,
  Calendar,
  Badge,
  Empty,
} from "antd";
import { DownOutlined } from "@ant-design/icons";

import NewsModel from "../../../models/NewsModel";
import ClassgroupModel from "../../../models/ClassgroupModel";
import LineModel from "../../../models/LineModel";

const news_model = new NewsModel();
const classgroup_model = new ClassgroupModel();
const line_model = new LineModel();

export default function News() {
  let code = useRouteMatch("/class-group/news/:code");
  const [news, setNews] = useState({
    news_head: "",
    news_code: "",
    news_detail: "",
    news_notice_day: "",
    news_time: "",
    news_image: "",
    classgroup_code: "",
    adddate: "",
    addby: "",
  });
  const [classgroup, setClassgroup] = useState([]);
  const [Checkdate, setCheckdate] = useState(false);
  const [feednews, setFeednews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkupdate, setCheckupdate] = useState(false);

  useEffect(() => {
    fetchFeedData();
    fetchData();
    setIsLoading(true);
  }, []);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const last_code = await news_model.getNewsByLastCode({});
    let news_obj = {};
    news_obj.news_code = last_code.data;
    news_obj.classgroup_code = code.params.code;
    news_obj.news_detail = "";
    news_obj.adddate = dayjs().format("YYYY-MM-DD H:mm:ss");
    news_obj.addby = user_session.user_uid;
    setNews(news_obj);
  }

  async function fetchFeedData() {
    const news_feed = await news_model.getNewsByCode({
      classgroup_code: code.params.code,
    });
    setFeednews(news_feed.data);

    const classgroup_data = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    });
    let class_obj = {};
    class_obj.subject_name = classgroup_data.data[0].subject_fullname;
    class_obj.class_own = classgroup_data.data[0].user_fullname;
    setClassgroup(class_obj);
  }

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setNews({ ...news, [name]: value });
  };

  async function _handleSubmit() {
    if (_checkSubmit()) {
      if (!Checkdate) {
        let query_result = await news_model.insertNews({
          news_code: news.news_code,
          news_detail: news.news_detail,
          news_notice_day: news.news_notice_day,
          news_image: news.news_image,
          classgroup_code: news.classgroup_code,
          adddate: news.adddate,
          addby: news.addby,
          subject_name: classgroup.subject_name,
          class_own: classgroup.class_own,
        });

        if (query_result.require) {
          Swal.fire("?????????????????????????????????????????????", "", "success");
          window.location.reload();
        } else {
          Swal.fire("?????????????????? ?????????????????????????????????????????????????????????!", "", "error");
          window.location.reload();
        }
      } else {
        let query_result = await line_model.notifyredirect({
          news_code: news.news_code,
          news_detail: news.news_detail,
          news_notice_day: news.news_notice_day,
          news_image: news.news_image,
          classgroup_code: news.classgroup_code,
          messege: news.news_detail,
          adddate: news.adddate,
          addby: news.addby,
          subject_name: classgroup.subject_name,
          class_own: classgroup.class_own,
        });

        if (query_result.require) {
          Swal.fire("?????????????????????????????????????????????", "", "success");
          window.location.reload();
          // history.push("/leave-student");
        } else {
          Swal.fire("?????????????????? ?????????????????????????????????????????????????????????!", "", "error");
          window.location.reload();
        }
      }
    }
  }

  function _onDelete(data) {
    Swal.fire({
      title: "???????????????????????????????????????????????????????????????",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        news_model
          .deleteNewsByCode({
            news_code: data,
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

  const _checkSubmit = () => {
    if (news.news_detail === "") {
      Swal.fire({
        title: "???????????????????????????!",
        text: "????????????????????????????????? ????????????????????????????????????????????????????????????????????????",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  const menu = (data) => (
    <Menu style={{ fontSize: "10px" }}>
      <Menu.Item key="0" onClick={() => editFeed(data)}>
        <a>????????????????????????????????????</a>
      </Menu.Item>
      <Menu.Item key="1" onClick={() => _onDelete(data.news_code)}>
        <a>???????????????</a>
      </Menu.Item>
    </Menu>
  );

  const _handleUpdate = async () => {
    if (_checkSubmit()) {
      let query_result = await news_model.updateNewsBy({
        news_code: news.news_code,
        news_detail: news.news_detail,
        news_notify: news.news_notify,
        news_image: news.news_image,
        classgroup_code: news.classgroup_code,
        adddate: dayjs(news.adddate).format("YYYY-MM-DD H:mm:ss"),
        addby: news.addby,
      });
      if (query_result.require) {
        Swal.fire("?????????????????????????????????????????????", "", "success");
        window.location.reload();
      } else {
        Swal.fire("?????????????????? ?????????????????????????????????????????????????????????!", "", "error");
      }
    }
  };

  const editFeed = (data) => {
    setCheckupdate(!checkupdate);
    setNews(data);
  };

  function getDateData(value) {
    let dateformat = dayjs(value._d).format("DD-MM-YYYY");
    let appointment = feednews
      .filter((appoint) => appoint.news_notice_day !== null)
      .map((item) => {
        return item.news_notice_day;
      });

    let aptt = appointment.map((items) => {
      if (dateformat === items) {
        return <Badge status="warning"></Badge>;
      }
    });
    return aptt || [];
  }

  function dateCellRender(value) {
    const num = getDateData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
      </div>
    ) : null;
  }

  return (
    <div align="center">
      {!isLoading ? (
        <div>
          <CImg src="https://cdn.dribbble.com/users/108183/screenshots/4543219/loader_backinout.gif" />
        </div>
      ) : (
        <>
          <CRow>
            <CCol xl="8">
              <CCard style={{ width: "100%" }}>
                <CCardHeader
                  className="header-t-red"
                  style={{ fontSize: "20px" }}
                >
                  ??????????????????????????????
                </CCardHeader>
                <CCardBody align="left">
                  <CRow>
                    <CCol>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="???????????????????????????????????????????????????????????????"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          name="news_detail"
                          value={news.news_detail}
                          onChange={(e) => _changeFrom(e)}
                        />
                      </FloatingLabel>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm="3">
                      {/* <CForm className="row g-3"> */}
                      <Switch
                        defaultUnChecked
                        checkedChildren="?????????????????????"
                        unCheckedChildren="??????????????????????????????"
                        onChange={() => {
                          setCheckdate(!Checkdate);
                        }}
                      />
                      <br />
                      <br />
                      {Checkdate ? (
                        <>
                          <Space direction="vertical">
                            <DatePicker
                              format={"DD/MM/YYYY"}
                              onChange={(e) =>
                                setNews({
                                  ...news,
                                  news_notice_day: dayjs(e._d).format(
                                    "DD-MM-YYYY"
                                  ),
                                  // news_time: dayjs(e._d)
                                  //   .format("H:mm:ss"),
                                })
                              }
                            />
                          </Space>
                        </>
                      ) : null}
                      {/* </CForm> */}
                    </CCol>
                  </CRow>
                </CCardBody>
                <CCardFooter>
                  {!checkupdate ? (
                    <CButton color="success" onClick={() => _handleSubmit()}>
                      ?????????????????????
                    </CButton>
                  ) : (
                    <CButton color="success" onClick={() => _handleUpdate()}>
                      ??????????????????????????????????????????
                    </CButton>
                  )}

                  <Link to={`/class-group`}>
                    <CButton type="button" color="danger">
                      {" "}
                      ????????????????????????{" "}
                    </CButton>
                  </Link>
                </CCardFooter>
              </CCard>

              <CCard style={{ width: "100%", fontSize: "20px" }}>
                <CCardHeader className="header-t-red">?????????????????????</CCardHeader>

                {feednews.length == 0 ? (
                  <CCardBody>
                    {" "}
                    <Empty />
                  </CCardBody>
                ) : (
                  <CCardBody>
                    {/* inform */}
                    {feednews.map((data) => {
                      return (
                        <CCard>
                          <CCardHeader align="left">
                            <CRow>
                              <CCol>
                                <CForm>
                                  <CFormGroup>
                                    <CLabel style={{ fontSize: "15px" }}>
                                      {data.owner_fullname}
                                    </CLabel>
                                    {/* <br /> */}
                                    <CFormText style={{ fontSize: "10px" }}>
                                      {dayjs(data.adddate)
                                        .locale("th")
                                        .format("DD MMMM YYYY")}
                                    </CFormText>
                                  </CFormGroup>
                                </CForm>
                              </CCol>
                              <CCol align="right" style={{ fontSize: "10px" }}>
                                <Dropdown
                                  overlay={menu(data)}
                                  trigger={["click"]}
                                >
                                  <a
                                    className="ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    ???????????????
                                    <DownOutlined />
                                  </a>
                                </Dropdown>
                              </CCol>
                            </CRow>
                          </CCardHeader>
                          <CCardBody fontSize="15px" align="left">
                            <CRow>
                              <CCol>{data.news_detail}</CCol>
                            </CRow>
                            {data.news_notice_day !== null ? (
                              <CRow>
                                <CCol style={{ fontSize: "15px" }}>
                                  <strong>???????????????????????????????????????</strong>{" "}
                                  {data.news_notice_day}
                                </CCol>
                              </CRow>
                            ) : null}
                          </CCardBody>
                        </CCard>
                      );
                    })}
                  </CCardBody>
                )}
              </CCard>
            </CCol>

            <CCol>
              <div className="site-calendar-demo-card">
                <Calendar
                  fullscreen={false}
                  dateCellRender={dateCellRender}
                  // monthCellRender={monthCellRender}
                />
              </div>
            </CCol>
          </CRow>
        </>
      )}
    </div>
  );
}
