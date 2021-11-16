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
} from "@coreui/react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Swal from "sweetalert2";
import { FloatingLabel, Form } from "react-bootstrap";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import {
  DatePicker,
  Space,
  Switch,
  Spin,
  Menu,
  Dropdown,
  Calendar,
  Badge,
} from "antd";
import { DownOutlined } from "@ant-design/icons";

import NewsModel from "../../../models/NewsModel";

const news_model = new NewsModel();

export default function News() {
  let code = useRouteMatch("/class-group/news/:code");
  const [news, setNews] = useState({
    news_code: "",
    news_detail: "",
    news_notify: "",
    news_image: "",
    classgroup_code: "",
    adddate: "",
    addby: "",
  });
  const [Checkdate, setCheckdate] = useState(false);
  const [feednews, setFeednews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkupdate, setCheckupdate] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    fetchFeedData();
  }, []);
  // console.log("news", news);
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
    setIsLoading(false);
  }

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setNews({ ...news, [name]: value });
  };

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await news_model.insertNews({
        news_code: news.news_code,
        news_detail: news.news_detail,
        news_notify: news.news_notify,
        news_image: news.news_image,
        classgroup_code: news.classgroup_code,
        adddate: news.adddate,
        addby: news.addby,
      });
      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        window.location.reload();
        // history.push("/leave-student");
      } else {
        Swal.fire("ขออภัย มีอย่างอย่างผิดพลาด!", "", "error");
      }
    }
  }

  function _onDelete(data) {
    Swal.fire({
      title: "คุณต้องการลบรายการนี้",
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
              Swal.fire("ลบรายการ เรียบร้อย", "", "success");
              window.location.reload();
            } else {
              Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
            }
          });
      }
    });
  }

  const _checkSubmit = () => {
    if (news.news_detail === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบ เนื้อหาที่ต้องการเผยแพร่",
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
        <a>แก้ไขข้อความ</a>
      </Menu.Item>
      <Menu.Item key="1" onClick={() => _onDelete(data.news_code)}>
        <a>ลบโพส</a>
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
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        window.location.reload();
      } else {
        Swal.fire("ขออภัย มีอย่างอย่างผิดพลาด!", "", "error");
      }
    }
  };

  const editFeed = (data) => {
    setCheckupdate(!checkupdate);
    setNews(data);
  };

  function getListData(value) {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
        ];
        break;
      case 10:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
          { type: "error", content: "This is error event." },
        ];
        break;
      case 15:
        listData = [
          { type: "warning", content: "This is warning event" },
          { type: "success", content: "This is very long usual event。。...." },
          { type: "error", content: "This is error event 1." },
          { type: "error", content: "This is error event 2." },
          { type: "error", content: "This is error event 3." },
          { type: "error", content: "This is error event 4." },
        ];
        break;
      default:
    }
    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }

  function getMonthData(value) {
    if (value.month() === 8) {
      return 1394;
    }
  }

  function monthCellRender(value) {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  return (
    <div align="center">
      {isLoading ? (
        <div className="spin-load">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <CRow>
            <CCol xl="8">
              <CCard style={{ width: "100%" }}>
                <CCardHeader style={{ fontSize: "20px" }}>
                  กระดานข่าว
                </CCardHeader>
                <CCardBody align="left">
                  <CRow>
                    <CCol>
                      <FloatingLabel
                        controlId="floatingInput"
                        label="สิ่งที่ต้องการเผยแพร่"
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
                    <CCol>
                      <CForm className="row g-3">
                        <CCol xs="auto">
                          <Switch
                            defaultUnChecked
                            checkedChildren="นักหมาย"
                            unCheckedChildren="ไม่นัดหมาย"
                            onChange={() => {
                              setCheckdate(!Checkdate);
                            }}
                          />{" "}
                        </CCol>
                        <CCol>
                          {Checkdate ? (
                            <>
                              <Space direction="vertical">
                                <DatePicker
                                  format={"DD/MM/YYYY"}
                                  onChange={(e) =>
                                    setNews({
                                      ...news,
                                      news_notify: dayjs(e._d).format(
                                        "YYYY-MM-DD H:mm:ss"
                                      ),
                                    })
                                  }
                                />
                              </Space>
                            </>
                          ) : null}
                        </CCol>
                      </CForm>
                    </CCol>
                  </CRow>
                </CCardBody>
                <CCardFooter>
                  {!checkupdate ? (
                    <CButton color="success" onClick={() => _handleSubmit()}>
                      เผยแพร่
                    </CButton>
                  ) : (
                    <CButton color="success" onClick={() => _handleUpdate()}>
                      บันทึกการแก้ไข
                    </CButton>
                  )}

                  <Link to={`/class-group`}>
                    <CButton type="button" color="danger">
                      {" "}
                      ย้อนกลับ{" "}
                    </CButton>
                  </Link>
                </CCardFooter>
              </CCard>
              <CCard style={{ width: "100%", fontSize: "20px" }}>
                <CCardHeader>ฟีดข่าว</CCardHeader>
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
                                  แก้ไข
                                  <DownOutlined />
                                </a>
                              </Dropdown>
                            </CCol>
                          </CRow>
                          <CRow>
                            <CCol>{data.news_detail}</CCol>
                          </CRow>
                        </CCardHeader>
                        {/* <CCardBody fontSize="15px" align="left">
                      {data.news_detail}
                    </CCardBody> */}
                      </CCard>
                    );
                  })}
                </CCardBody>
              </CCard>
            </CCol>
            <CCol>
              <Calendar
                dateCellRender={dateCellRender}
                monthCellRender={monthCellRender}
              />
            </CCol>
          </CRow>
        </>
      )}
    </div>
  );
}
