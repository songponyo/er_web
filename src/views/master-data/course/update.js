import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { Select } from "../../../component/revel-strap";

import GLOBAL from "../../../GLOBAL";

import LicenseModel from "../../../models/LicenseModel";
import UserModel from "../../../models/UserModel";
import UserPositionModel from "../../../models/UserPositionModel";

import { FileService } from "../../../utility";

const license_model = new LicenseModel();
const user_model = new UserModel();
const user_position_model = new UserPositionModel();

const file_service = new FileService();

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showloading: true,
      username_validate: {
        value: "",
        status: "",
        class: "",
        text: "",
      },
      user_code: "",
      license_code: "",
      user_position_code: "",
      user_prefix: "นาย",
      user_name: "",
      user_lastname: "",
      user_tel: "",
      user_email: "",
      user_username: "",
      user_password: "",
      user_address: "",
      user_zipcode: "",
      user_profile_image: {
        src: "",
        file: null,
        old: "",
      },
      user_status: "Active",
      license: [],
      user_positions: [],
      upload_path: "user/",
    };
  }

  async componentDidMount() {
    const { code } = this.props.match.params;

    const user = await user_model.getUserByCode({ user_code: code });

    if (user.require === false) {
      Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", "", "error");
      this.props.history.push("/user");
    } else if (user.data.length === 0) {
      Swal.fire("ไม่พบรายการนี้ในระบบ !", "", "warning");
      this.props.history.push("/user");
    } else {
      const {
        user_code,
        license_code,
        user_position_code,
        user_prefix,
        user_name,
        user_lastname,
        user_tel,
        user_email,
        user_address,
        user_zipcode,
        user_username,
        user_password,
        user_profile_image,
        user_status,
      } = user.data[0];

      const user_positions = await user_position_model.getUserPositionBy();
      const license = await license_model.getLicenseBy();
      if(user_profile_image==""){
        this.setState({
          showloading: false,
          username_validate: {
            value: user_username,
            status: "VALID",
            class: "",
            text: "",
          },
          user_code: user_code,
          license_code: license_code,
          user_position_code: user_position_code,
          user_prefix: user_prefix,
          user_name: user_name,
          user_lastname: user_lastname,
          user_email: user_email,
          user_tel: user_tel,
          user_address: user_address,
          user_zipcode: user_zipcode,
          user_username: user_username,
          user_password: user_password,
          user_profile_image: {
            src: GLOBAL.BASE_SERVER.URL_IMG + "user-default.png",
            file: null,
            old: "",
          },
          user_status: user_status,
          user_positions: user_positions.data,
          license: license.data,
        });
      }else{

      this.setState({
        showloading: false,
        username_validate: {
          value: user_username,
          status: "VALID",
          class: "",
          text: "",
        },
        user_code: user_code,
        license_code: license_code,
        user_position_code: user_position_code,
        user_prefix: user_prefix,
        user_name: user_name,
        user_lastname: user_lastname,
        user_email: user_email,
        user_tel: user_tel,
        user_address: user_address,
        user_zipcode: user_zipcode,
        user_username: user_username,
        user_password: user_password,
        user_profile_image: {
          src: GLOBAL.BASE_SERVER.URL_IMG + user_profile_image,
          file: null,
          old: user_profile_image,
        },
        user_status: user_status,
        user_positions: user_positions.data,
        license: license.data,
      });
    }
    }
  }

  async _handleSubmit(event) {
    event.preventDefault();

    if (this._checkSubmit()) {
      let user_profile_image = "";

      const res_upload = await file_service.uploadFile({
        src: this.state.user_profile_image,
        upload_path: this.state.upload_path,
      });

      if (res_upload.require) {
        if (
          this.state.user_profile_image.old === undefined &&
          this.state.user_profile_image.old === ""
        ) {
          user_profile_image = res_upload.data.file_name;
        } else {
          await file_service.deleteFile({
            file_path: this.state.user_profile_image.old,
          });
          user_profile_image = res_upload.data.file_name;
        }
      } else {
        user_profile_image = this.state.user_profile_image.old;
      }
      const res = await user_model.updateUserBy({
        user_code: this.state.user_code.trim(),
        license_code: this.state.license_code,
        user_position_code: this.state.user_position_code,
        user_prefix: this.state.user_prefix,
        user_name: this.state.user_name.trim(),
        user_lastname: this.state.user_lastname.trim(),
        user_tel: this.state.user_tel.trim(),
        user_email: this.state.user_email.trim(),
        user_address: this.state.user_address.trim(),
        user_zipcode: this.state.user_zipcode.trim(),
        user_username: this.state.user_username.trim(),
        user_password: this.state.user_password.trim(),
        user_profile_image: user_profile_image,
        user_status: this.state.user_status,
        updateby: this.props.USER.user_code,
      });

      if (res.require) {
        Swal.fire("Save success!!", "", "success");
        this.props.history.push("/user");
      } else {
        Swal.fire("Sorry, Someting worng !", "", "error");
      }
    }
  }

  _checkSubmit() {
    const user_password = this.state.user_password.trim();

    if (this.state.username_validate.status !== "VALID") {
      Swal.fire(this.state.username_validate.text);
      return false;
    } else if (this.state.license_code === "") {
      Swal.fire("กรุณาระบุสิทธิ์การใช้ / Please input License");
      return false;
    } else if (this.state.user_position_code === "") {
      Swal.fire("กรุณาระบุตำแหน่ง / Please input Position");
      return false;
    } else if (user_password.length < 6 || user_password.length > 20) {
      Swal.fire("Password should be 6-20 characters");
      return false;
    } else {
      return true;
    }
  }

  async _checkUsername() {
    const user_code = this.state.user_code.trim();
    const username = this.state.user_username.trim();

    if (this.state.username_validate.value !== username) {
      if (username.length === 0) {
        this.setState({
          username_validate: {
            value: username,
            status: "INVALID",
            class: "",
            text: "Please input Username",
          },
        });
      } else if (username.length < 5 || username.length > 20) {
        this.setState({
          username_validate: {
            value: username,
            status: "INVALID",
            class: "is-invalid",
            text: "Username should be 5-20 characters",
          },
        });
      } else {
        const user = await user_model.checkUsernameBy({
          user_username: username,
          user_code: user_code,
        });

        if (user.data.length) {
          this.setState({
            username_validate: {
              value: username,
              status: "INVALID",
              class: "is-invalid",
              text: "This code already exists.",
            },
          });
        } else {
          this.setState({
            username_validate: {
              value: username,
              status: "VALID",
              class: "is-valid",
              text: "",
            },
          });
        }
      }
    }
  }

  _handleImageChange(img_name, e) {
    if (e.target.files.length) {
      let file = new File([e.target.files[0]], e.target.files[0].name, {
        type: e.target.files[0].type,
      });

      if (file !== undefined) {
        let reader = new FileReader();

        reader.onloadend = () => {
          this.setState((state) => {
            if (img_name === "user_profile_image") {
              return {
                user_profile_image: {
                  src: reader.result,
                  file: file,
                  old: state.user_profile_image.old,
                },
              };
            }
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  render() {
    const license_options = this.state.license.map((item) => ({
      value: item.license_code,
      label: item.license_name,
    }));

    const user_prefix_options = [
      { value: "นาย", label: "นาย" },
      { value: "นาง", label: "นาง" },
      { value: "นางสาว", label: "นางสาว" },
    ];

    const user_status_options = [
      { value: "Active", label: "ทำงาน" },
      { value: "Inactive", label: "เลิกทำงาน" },
    ];

    const user_position_options = this.state.user_positions.map((item) => ({
      value: item.user_position_code,
      label: item.user_position_name,
    }));

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader className="header-t-red" >แก้ไขบัญชีผู้ใช้งาน / Update User</CardHeader>
          <Form onSubmit={this._handleSubmit.bind(this)}>
            <CardBody>
              <Row>
                <Col md="8">
                  <Row>
                    <Col md="3">
                      <Label>
                        รหัสพนักงาน{" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </Label>
                      <Input
                        type="text"
                        id="user_code"
                        name="user_code"
                        value={this.state.user_code}
                        readOnly
                      />
                      <p className="text-muted">Example : U0001.</p>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>
                          คำนำหน้า{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>
                        </Label>
                        <Select
                          options={user_prefix_options}
                          value={this.state.user_prefix}
                          onChange={(e) => this.setState({ user_prefix: e })}
                        />
                        <p className="text-muted">Example : นาย.</p>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>
                          ชื่อ{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>
                        </Label>
                        <Input
                          type="text"
                          id="user_name"
                          name="user_name"
                          value={this.state.user_name}
                          onChange={(e) =>
                            this.setState({ user_name: e.target.value })
                          }
                        />
                        <p className="text-muted">Example : วินัย.</p>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>
                          นามสกุล{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>
                        </Label>
                        <Input
                          type="text"
                          id="user_lastname"
                          name="user_lastname"
                          value={this.state.user_lastname}
                          onChange={(e) =>
                            this.setState({ user_lastname: e.target.value })
                          }
                        />
                        <p className="text-muted">Example : ชาญชัย.</p>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="3">
                      <FormGroup>
                        <Label>อีเมล์ </Label>
                        <Input
                          type="email"
                          id="user_email"
                          name="user_email"
                          value={this.state.user_email}
                          onChange={(e) =>
                            this.setState({ user_email: e.target.value })
                          }
                        />
                        <p className="text-muted">
                          Example : admin@arno.co.th.
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>โทรศัพท์ </Label>
                        <Input
                          type="text"
                          id="user_tel"
                          name="user_tel"
                          value={this.state.user_tel}
                          onChange={(e) =>
                            this.setState({ user_tel: e.target.value })
                          }
                        />
                        <p className="text-muted">Example : 0610243003.</p>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>
                          Username{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>
                        </Label>
                        <Input
                          type="text"
                          id="user_username"
                          name="user_username"
                          value={this.state.user_username}
                          className={this.state.username_validate.class}
                          onChange={(e) =>
                            this.setState({ user_username: e.target.value })
                          }
                          onBlur={() => this._checkUsername()}
                          required
                        />
                        <p className="text-muted">Example : thana.</p>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup>
                        <Label>
                          Password{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>
                        </Label>
                        <Input
                          type="password"
                          id="user_password"
                          name="user_password"
                          value={this.state.user_password}
                          onChange={(e) =>
                            this.setState({ user_password: e.target.value })
                          }
                          required
                        />
                        <p className="text-muted">Example : thanaadmin.</p>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8">
                      <FormGroup>
                        <Label>
                          ที่อยู่{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </Label>
                        <Input
                          type="textarea"
                          id="user_address"
                          name="user_address"
                          row={3}
                          value={this.state.user_address}
                          onChange={(e) =>
                            this.setState({ user_address: e.target.value })
                          }
                        />
                        <p className="text-muted">Example : 271/55.</p>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>
                          เลขไปรษณีย์{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </Label>
                        <Input
                          type="text"
                          id="user_zipcode"
                          name="user_zipcode"
                          onChange={(e) =>
                            this.setState({ user_zipcode: e.target.value })
                          }
                          value={this.state.user_zipcode}
                        />
                        <p className="text-muted">Example : 30000.</p>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>
                          ตำแหน่ง{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </Label>
                        <Select
                          options={user_position_options}
                          value={this.state.user_position_code}
                          onChange={(e) =>
                            this.setState({ user_position_code: e })
                          }
                        />
                        <p className="text-muted">Example : ผู้ดูแลระบบ.</p>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>
                          สิทธิ์การใช้งาน{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </Label>
                        <Select
                          options={license_options}
                          value={this.state.license_code}
                          onChange={(e) => this.setState({ license_code: e })}
                        />
                        <p className="text-muted">
                          Example : สิทธิ์การใช้งานที่ 1.
                        </p>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>
                          สถานะ{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </Label>
                        <Select
                          options={user_status_options}
                          value={this.state.user_status}
                          onChange={(e) => this.setState({ user_status: e })}
                        />
                        <p className="text-muted">Example : ทำงาน.</p>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>โปรไฟล์ </Label>
                    <br></br>
                    <div className="text-center">
                    <img
                        className="image-upload"
                        style={{ maxWidth: 280 }}
                        src={
                          this.state.user_profile_image.src !== null
                            ? this.state.user_profile_image.src
                            : this.state.user_profile_image.old !== ""
                              ? GLOBAL.BASE_SERVER.URL_IMG + this.state.user_profile_image.old
                              : this.state.user_profile_image.src
                        }
                        alt="profile"
                      />
                    </div>
                    <Input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="form-control"
                      onChange={(e) =>
                        this._handleImageChange("user_profile_image", e)
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button type="submit" color="success">
                บันทึก
              </Button>
              <Link to="/user">
                <Button type="button"  color="danger"> ย้อนกลับ </Button>
              </Link>
            </CardFooter>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    _USER: state._USER,
  };
};

export default connect(mapStatetoProps)(Update);
