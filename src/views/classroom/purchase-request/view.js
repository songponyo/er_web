import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Nav,
  TabContent,
  TabPane,
  Input,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import PurchaseRequestModel from '../../../models/PurchaseRequestModel'
import UserModel from "../../../models/UserModel";
import { TimeFormat } from "../../../utility";

import { DatePicker, Loading, Table, Select } from "../../../component/revel-strap";

const time_format = new TimeFormat();
const user_model = new UserModel();
const purchase_request_model = new PurchaseRequestModel();

class View extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();

    this.state = {
      user_code: '',
      keyword: '',
      loading: true,
      show_revise_modal: false,
      active_tab: "wait",
      date_start: new Date(y, m + 1, 0),
      date_end: new Date(y, m + 1, 0),

      purchase_requests: {
        waits: [],
        approves: [],
        not_approves: [],
        cancels: [],
      },
      purchase_request_revises: [],
      users: []
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData(
    params = { pagination: { current: 1, pageSize: 20 } },
    section = ""
  ) {
    this.setState({
      loading: true,
    }, async () => {
      const users = await user_model.getUserBy();
      let { purchase_requests } = this.state;
      if (section === "wait" || section === "") {
        purchase_requests.waits = await purchase_request_model.getPurchaseRequestBy({
          user_code: this.state.user_code,
          keyword: this.state.keyword,
          params: params,
          condition: "AND purchase_request_approve_status = 'Waiting' AND purchase_request_cancel = 0 ",
        })
      }
      if (section === "approve" || section === "") {
        let approves = await purchase_request_model.getPurchaseRequestBy({
          // date_start: this.state.date_start,
          // date_end: this.state.date_end,
          user_code: this.state.user_code,
          keyword: this.state.keyword,
          params: params,
          condition: "AND purchase_request_approve_status = 'Approve' AND purchase_request_cancel = 0 ",
        });
        for (let i in approves.data) {
          let purchase_orders = await purchase_request_model.getPurchaseRequestOrderByCode(
            { purchase_request_code: approves.data[i].purchase_request_code }
          );

          approves.data[i].purchase_orders = purchase_orders.data;
        }
        purchase_requests.approves = approves;
      }

      if (section === "not_approve" || section === "") {
        purchase_requests.not_approves = await purchase_request_model.getPurchaseRequestBy(
          {
            // date_start: this.state.date_start,
            // date_end: this.state.date_end,
            user_code: this.state.user_code,
            keyword: this.state.keyword,
            params: params,
            condition: "AND purchase_request_approve_status = 'not_Approve' AND purchase_request_cancel = 0 ",
          }
        );
      }
      if (section === "cancel" || section === "") {
        purchase_requests.cancels = await purchase_request_model.getPurchaseRequestBy(
          {
            // date_start: this.state.date_start,
            // date_end: this.state.date_end,
            user_code: this.state.user_code,
            keyword: this.state.keyword,
            params: params,
            condition: "AND purchase_request_cancel = 1 ",
          }
        );
      }
      this.setState({
        loading: false,
        purchase_requests: purchase_requests,
        user_code: this.props.USER.user_code,
        users: users.data,
      });
    }
    );
  }

  async _getReviseBy(code) {
    const purchase_request_revises = await purchase_request_model.getPurchaseRequestBy({
      condition: "AND purchase_request_revise_code = '" + code + "' ",
    }
    );

    this.setState({
      show_revise_modal: true,
      purchase_request_revises: purchase_request_revises.data,
    });
  }

  _onRevise(code) {
    Swal.fire({
      title: "ต้องการเขียนรายการนี้ใหม่ ?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.setState({
          loading: true,
        }, async () => {
          purchase_request_model.cancelPurchaseRequestByCode({ purchase_request_code: code, purchase_request_type: "purchase_request", }).then((res) => {
            if (res.require) {
              this.props.history.push("/purchase-request/revise/" + code);
            } else {
              this.setState({ loading: false });
              Swal.fire("เกิดข้อผิดพลาด !", "", "error");
            }
          });
        }
        );
      }
    });
  }

  _onUnCancel(code) {
    Swal.fire({
      title: "ต้องการที่จะกู้คืนรายการนี้ ?",
      icon: "info",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.setState(
          {
            loading: true,
          },
          async () => {
            purchase_request_model.unCancelPurchaseRequestByCode({ purchase_request_code: code }).then((res) => {
              if (res.require) {
                Swal.fire("กู้คืนสำเร็จ !", "", "success");
                this._fetchData();
              } else {
                this.setState({ loading: false });
                Swal.fire("เกิดข้อผิดพลาด !", "", "error");
              }
            });
          }
        );
      }
    });
  }

  _onDelete(code) {
    Swal.fire({
      title: "ต้องการลบรายการนี้ ?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.setState(
          {
            loading: true,
          },
          async () => {
            purchase_request_model.deletePurchaseRequestByCode({ purchase_request_code: code }).then((res) => {
              if (res.require) {
                Swal.fire("ลบรายการสำเร็จ !", "", "success");
                // this._fetchData();
                window.location.reload()
              } else {
                this.setState({ loading: false });
                Swal.fire("เกิดข้อผิดพลาด !", "", "error");
              }
            });
          }
        );
      }
    });
  }

  render() {
    const user_options = this.state.users.map((item) => ({
      label: item.user_name + " " + item.user_lastname, value: item.user_code,
    }));
    const { purchase_requests } = this.state;
    const { permission_add, permission_edit, permission_cancel, permission_delete, } = this.props.PERMISSION;


    return (
      <div className="animated fadeIn">
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader className="header-t-red">
            รายการใบขอซื้อ / Purchase Request
            {permission_add ? (
              <Link
                to={`/purchase-request/insert`}
                className="btn btn-success float-right"
              >
                <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มใบขอซื้อ
              </Link>
            ) : null}
          </CardHeader>
          <CardBody>
            <FormGroup
              style={{
                display: "inline-block",
                verticalAlign: "bottom",
                marginRight: "8px",
              }}
            >
              <Label> ผู้ร้องขอ</Label>
              <Select
                options={user_options}
                value={this.state.user_code}
                onChange={(user_code) => this.setState({ user_code })}
              />
            </FormGroup>
            <FormGroup
              style={{ display: "inline-block", verticalAlign: "bottom" }}
            >
              <div style={{ display: "inline-block" }}>
                <Label> วันที่ </Label>
                <DatePicker
                  format={"DD/MM/YYYY"}
                  value={this.state.date_start}
                  onChange={(date_start) => this.setState({ date_start })}
                />
              </div>{" "}
              -{" "}
              <div style={{ display: "inline-block", marginRight: "8px" }}>
                <DatePicker
                  format={"DD/MM/YYYY"}
                  value={this.state.date_end}
                  onChange={(date_end) => this.setState({ date_end })}
                />
              </div>
            </FormGroup>
            <FormGroup
              style={{ display: "inline-block", verticalAlign: "bottom" }}
            > 
              <Label> คำค้น </Label>
              <Input
                type="text"
                value={this.state.keyword}
                onChange={(e) => this.setState({ keyword: e.target.value })}
              />
            </FormGroup>
            <FormGroup
              style={{ display: "inline-block", verticalAlign: "bottom" }}
            >
              <Button
                className="btn btn-info"
                onClick={() => this._fetchData()}
              
              >
                {" "}
                ค้นหา{" "}
              </Button>
            </FormGroup>
            <Nav tabs style={{ marginTop: "10px" }}>
              <li
                className={`nav-link ${
                  this.state.active_tab === "wait" ? "active" : ""
                }`}
                onClick={() => this.setState({ active_tab: "wait" })}
              >
                รออนุมัติ{" "}
                {purchase_requests.waits.data !== undefined &&
                purchase_requests.waits.data.length ? (
                  <span className="badge-secondary badge-pill">
                    {" "}
                    {purchase_requests.waits.data.length}{" "}
                  </span>
                ) : null}
              </li>
              <li
                className={`nav-link ${
                  this.state.active_tab === "approve" ? "active" : ""
                }`}
                onClick={() => this.setState({ active_tab: "approve" })}
              >
                อนุมัติแล้ว{" "}
                {purchase_requests.approves.data !== undefined &&
                purchase_requests.approves.data.length ? (
                  <span className="badge-secondary badge-pill">
                    {" "}
                    {purchase_requests.approves.data.length}{" "}
                  </span>
                ) : null}
              </li>
              <li
                className={`nav-link ${
                  this.state.active_tab === "not_approve" ? "active" : ""
                }`}
                onClick={() => this.setState({ active_tab: "not_approve" })}
              >
                ไม่อนุมัติ{" "}
                {purchase_requests.not_approves.data !== undefined &&
                purchase_requests.not_approves.data.length ? (
                  <span className="badge-secondary badge-pill">
                    {" "}
                    {purchase_requests.not_approves.data.length}{" "}
                  </span>
                ) : null}
              </li>
              <li
                className={`nav-link ${
                  this.state.active_tab === "cancel" ? "active" : ""
                }`}
                onClick={() => this.setState({ active_tab: "cancel" })}
              >
                รายการยกเลิก{" "}
                {purchase_requests.cancels.data !== undefined &&
                purchase_requests.cancels.data.length ? (
                  <span className="badge-secondary badge-pill">
                    {" "}
                    {purchase_requests.cancels.data.length}{" "}
                  </span>
                ) : null}
              </li>
            </Nav>
            <TabContent
              activeTab={this.state.active_tab}
              style={{ border: "unset" }}
            >
              <TabPane tabId="wait" style={{ padding: "unset" }}>
                <Table
                  onChange={(e) => this._fetchData(e, "wait")}
                  showRowNo={true}
                  dataSource={this.state.purchase_requests.waits.data}
                  dataTotal={this.state.purchase_requests.waits.total}
                  rowKey="purchase_request_code"
                  columns={[
                    {
                      title: "รหัสใบขอซื้อ",
                      align: "center",
                      dataIndex: "purchase_request_code",
                      render: (cell, row, index) => (
                        <>
                          {row.purchase_request_code}
                          {row.count_revise ? (
                            <Link
                              to={`#`}
                              style={{ color: "red", marginLeft: 6 }}
                              onClick={() =>
                                this._getReviseBy(
                                  row.purchase_request_revise_code
                                )
                              }
                            >
                              <i
                                className="fa fa-search"
                                aria-hidden="true"
                              ></i>
                            </Link>
                          ) : null}
                        </>
                      ),
                      filterAble: true,
                      ellipsis: true,
                      width: 200,
                    },
                    {
                      title: "วันที่",
                      dataIndex: "purchase_request_date",
                      render: (cell) => time_format.showDateTH(cell),
                      sorter: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "ร้องขอโดย",
                      dataIndex: "user_name",
                      align: "center",
                      filterAble: true,
                      ellipsis: true,
                      width: 220,
                    },
                    {
                      title: "หมายเหตุ",
                      dataIndex: "purchase_request_approve_remark",
                      responsive: ["lg"],
                      align: "center",
                      ellipsis: true,
                      width: 120,
                    },
                    {
                      title: "จัดการ",
                      dataIndex: "",
                      align: "center",
                      render: (cell) => {
                        const row_accessible = [
                          <Link
                            key="detail"
                            to={`/purchase-request/detail/${cell.purchase_request_code}`}
                            title="รายละเอียด"
                          >
                            <button
                              type="button"
                              className="icon-button color-primary"
                            >
                              <i className="fa fa-search" aria-hidden="true" />
                            </button>
                          </Link>,
                        ];

                        if (permission_edit) {
                          row_accessible.push(
                            <Link
                              key="update"
                              to={`/purchase-request/update/${cell.purchase_request_code}`}
                              title="แก้ไขรายการ"
                            >
                              <button
                                type="button"
                                className="icon-button color-warning"
                              >
                                <i
                                  className="fa fa-pencil-square-o"
                                  aria-hidden="true"
                                />
                              </button>
                            </Link>
                          );
                        }
                        if (permission_delete) {
                          row_accessible.push(
                            <button
                              key="delete"
                              type="button"
                              className="icon-button color-danger"
                              onClick={() =>
                                this._onDelete(cell.purchase_request_code)
                              }
                              title="ลบรายการ"
                            >
                              <i
                                className="fa fa-times-circle"
                                aria-hidden="true"
                              />
                            </button>
                          );
                        }
                        return row_accessible;
                      },
                      width: 120,
                    },
                  ]}
                />
              </TabPane>
              <TabPane tabId="approve" style={{ padding: "unset" }}>
                <Table
                  onChange={(e) => this._fetchData(e, "approve")}
                  showRowNo={true}
                  dataSource={this.state.purchase_requests.approves.data}
                  dataTotal={this.state.purchase_requests.approves.total}
                  rowKey="purchase_request_code"
                  columns={[
                    {
                      title: "รหัสใบขอซื้อ",
                      dataIndex: "purchase_request_code",
                      render: (cell, row, index) => (
                        <>
                          {row.purchase_request_code}
                          {row.count_revise ? (
                            <Link
                              to={`#`}
                              style={{ color: "red", marginLeft: 6 }}
                              onClick={() =>
                                this._getReviseBy(
                                  row.purchase_request_revise_code
                                )
                              }
                            >
                              <i
                                className="fa fa-search"
                                aria-hidden="true"
                              ></i>
                            </Link>
                          ) : null}
                        </>
                      ),
                      filterAble: true,
                      ellipsis: true,
                      align: "center",
                      width: 200,
                    },
                    {
                      title: "วันที่",
                      dataIndex: "purchase_request_date",
                      render: (cell) => time_format.showDateTH(cell),
                      sorter: true,
                      align: "center",
                      width: 150,
                    },
                    {
                      title: "ร้องขอโดย",
                      dataIndex: "user_name",
                      filterAble: true,
                      ellipsis: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "อนุมัติโดย",
                      dataIndex: "approve_name",
                      filterAble: true,
                      ellipsis: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "เลขที่ใบสั่งซื้อ",
                      dataIndex: "purchase_orders",
                      render: (cell) =>
                        cell.map((item, idx) => (
                          <div key={idx} className="text-center">
                            <Link
                              to={
                                `/purchase-order/detail/` +
                                item.purchase_order_code
                              }
                            >
                              {" "}
                              {item.purchase_order_code}
                            </Link>
                          </div>
                        )),
                      ellipsis: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "หมายเหตุ",
                      dataIndex: "purchase_request_approve_remark",
                      responsive: ["lg"],
                      ellipsis: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "จัดการ",
                      align: "center",
                      dataIndex: "",
                      render: (cell) => {
                        return (
                          <Link
                            to={`/purchase-request/detail/${cell.purchase_request_code}`}
                            title="รายละเอียด"
                          >
                            <button
                              type="button"
                              className="icon-button color-primary"
                            >
                              <i className="fa fa-search" aria-hidden="true" />
                            </button>
                          </Link>
                        );
                      },
                      width: 120,
                    },
                  ]}
                />
              </TabPane>
              <TabPane tabId="not_approve" style={{ padding: "unset" }}>
                <Table
                  onChange={(e) => this._fetchData(e, "not_approve")}
                  showRowNo={true}
                  dataSource={this.state.purchase_requests.not_approves.data}
                  dataTotal={this.state.purchase_requests.not_approves.total}
                  rowKey="purchase_request_code"
                  columns={[
                    {
                      title: "รหัสใบขอซื้อ",
                      dataIndex: "purchase_request_code",
                      render: (cell, row, index) => (
                        <>
                          {row.purchase_request_code}
                          {row.count_revise ? (
                            <Link
                              to={`#`}
                              style={{ color: "red", marginLeft: 6 }}
                              onClick={() =>
                                this._getReviseBy(
                                  row.purchase_request_revise_code
                                )
                              }
                            >
                              <i
                                className="fa fa-search"
                                aria-hidden="true"
                              ></i>
                            </Link>
                          ) : null}
                        </>
                      ),
                      filterAble: true,
                      ellipsis: true,
                      width: 200,
                      align: "center",
                    },
                    {
                      title: "วันที่",
                      dataIndex: "purchase_request_date",
                      render: (cell) => time_format.showDateTH(cell),
                      sorter: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "ร้องขอโดย",
                      dataIndex: "user_name",
                      filterAble: true,
                      ellipsis: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "หมายเหตุ",
                      dataIndex: "purchase_request_approve_remark",
                      responsive: ["lg"],
                      ellipsis: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "จัดการ",
                      align: "center",
                      dataIndex: "",
                      render: (cell) => {
                        const row_accessible = [
                          <Link
                            key="detail"
                            to={`/purchase-request/detail/${cell.purchase_request_code}`}
                            title="รายละเอียด"
                          >
                            <button
                              type="button"
                              className="icon-button color-primary"
                            >
                              <i className="fa fa-search" aria-hidden="true" />
                            </button>
                          </Link>,
                        ];

                        if (permission_edit) {
                          row_accessible.push(
                            <Link
                              key="update"
                              to={`/purchase-request/update/${cell.purchase_request_code}`}
                              title="แก้ไขรายการ"
                            >
                              <button
                                type="button"
                                className="icon-button color-warning"
                              >
                                <i
                                  className="fa fa-pencil-square-o"
                                  aria-hidden="true"
                                />
                              </button>
                            </Link>
                          );
                        }
                        if (permission_cancel) {
                          row_accessible.push(
                            <button
                              key="revise"
                              type="button"
                              className="icon-button color-black"
                              onClick={() =>
                                this._onRevise(cell.purchase_request_code)
                              }
                              title="เขียนรายการใหม่"
                            >
                              <i
                                className="fa fa-registered"
                                aria-hidden="true"
                              />
                            </button>
                          );
                        }
                        if (permission_delete) {
                          row_accessible.push(
                            <button
                              key="delete"
                              type="button"
                              className="icon-button color-danger"
                              onClick={() =>
                                this._onDelete(cell.purchase_request_code)
                              }
                              title="ลบรายการ"
                            >
                              <i
                                className="fa fa-times-circle"
                                aria-hidden="true"
                              />
                            </button>
                          );
                        }
                        return row_accessible;
                      },
                      width: 120,
                    },
                  ]}
                />
              </TabPane>
              <TabPane tabId="cancel" style={{ padding: "unset" }}>
                <Table
                  onChange={(e) => this._fetchData(e, "cancel")}
                  showRowNo={true}
                  dataSource={this.state.purchase_requests.cancels.data}
                  dataTotal={this.state.purchase_requests.cancels.total}
                  rowKey="purchase_request_code"
                  columns={[
                    {
                      title: "รหัสใบขอซื้อ",
                      dataIndex: "purchase_request_code",
                      render: (cell, row, index) => (
                        <>
                          {row.purchase_request_code}
                          {row.count_revise ? (
                            <Link
                              to={`#`}
                              style={{ color: "red", marginLeft: 6 }}
                              onClick={() =>
                                this._getReviseBy(
                                  row.purchase_request_revise_code
                                )
                              }
                            >
                              <i
                                className="fa fa-search"
                                aria-hidden="true"
                              ></i>
                            </Link>
                          ) : null}
                        </>
                      ),
                      filterAble: true,
                      ellipsis: true,
                      width: 200,
                      align: "center",
                    },
                    {
                      title: "วันที่",
                      dataIndex: "purchase_request_date",
                      render: (cell) => time_format.showDateTH(cell),
                      sorter: true,
                      align: "center",
                      width: 120,
                    },
                    {
                      title: "ร้องขอโดย",
                      dataIndex: "user_name",
                      filterAble: true,
                      align: "center",
                      ellipsis: true,
                      width: 120,
                    },
                    {
                      title: "หมายเหตุ",
                      dataIndex: "purchase_request_approve_remark",
                      responsive: ["lg"],
                      align: "center",
                      ellipsis: true,
                      width: 120,
                    },
                    {
                      title: "จัดการ",
                      align: "center",
                      dataIndex: "",
                      render: (cell) => {
                        const row_accessible = [
                          <Link
                            key="detail"
                            to={`/purchase-request/detail/${cell.purchase_request_code}`}
                            title="รายละเอียด"
                          >
                            <button
                              type="button"
                              className="icon-button color-primary"
                            >
                              <i className="fa fa-search" aria-hidden="true" />
                            </button>
                          </Link>,
                        ];
                        if (
                          cell.count_revise === cell.purchase_request_revise_no
                        ) {
                          if (permission_cancel) {
                            row_accessible.push(
                              <button
                                key="uncancel"
                                type="button"
                                className="icon-button color-black"
                                onClick={() =>
                                  this._onUnCancel(cell.purchase_request_code)
                                }
                                title="เรียกคืนรายการ"
                              >
                                <i className="fa fa-undo" aria-hidden="true" />
                              </button>
                            );
                            row_accessible.push(
                              <button
                                key="revise"
                                type="button"
                                className="icon-button color-black"
                                onClick={() =>
                                  this._onRevise(cell.purchase_request_code)
                                }
                                title="เขียนรายการใหม่"
                              >
                                <i
                                  className="fa fa-registered"
                                  aria-hidden="true"
                                />
                              </button>
                            );
                          }
                          if (permission_delete) {
                            row_accessible.push(
                              <button
                                key="delete"
                                type="button"
                                className="icon-button color-danger"
                                onClick={() =>
                                  this._onDelete(cell.purchase_request_code)
                                }
                                title="ลบรายการ"
                              >
                                <i
                                  className="fa fa-times-circle"
                                  aria-hidden="true"
                                />
                              </button>
                            );
                          }
                        }
                        return row_accessible;
                      },
                      width: 120,
                    },
                  ]}
                />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default View;
