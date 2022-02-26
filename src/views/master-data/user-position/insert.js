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
  Label,
  Input,
  Row,
} from "reactstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import UserPositionModel from "../../../models/UserPositionModel";

const user_position_model = new UserPositionModel();

class Insert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showloading: true,
      code_validate: {
        value: "",
        status: "",
        class: "",
        text: "",
      },
      user_position_code: "",
      user_position_name: "",
    };
  }

  async componentDidMount() { 
    const max_code = await user_position_model.getUserPositionMaxCode({
      code: "UP",
      digit: 3,
    });

    this.setState({
      showloading: false,
      code_validate: {
        value: max_code.data,
        status: "VALID",
        class: "",
        text: "",
      },
      user_position_code: max_code.data,
    });
  }

  async _handleSubmit(event) {
    event.preventDefault();

    if (this._checkSubmit()) {
      const res = await user_position_model.insertUserPosition({
        user_position_code: this.state.user_position_code.trim(),
        user_position_name: this.state.user_position_name.trim(),
        addby: this.props.USER.user_code,
      });

      if (res.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        this.props.history.push("/user-position");
      } else {
        Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
      }
    }
  }

  _checkSubmit() {
    if (this.state.code_validate.status !== "VALID") {
      Swal.fire(this.state.code_validate.text);
      return false;
    } else if (this.state.user_position_name.trim().length === 0) {
      Swal.fire("กรุณาระบุชือตำแหน่ง / Please input Name");
      return false;
    } else {
      return true;
    }
  }

  async _checkCode() {
    const code = this.state.user_position_code.trim();

    if (code.length) {
      if (this.state.code_validate.value !== code) {
        const user_position = await user_position_model.getUserPositionByCode({
          user_position_code: code,
        });

        if (user_position.data.length) {
          this.setState({
            code_validate: {
              value: code,
              status: "INVALID",
              class: "is-invalid",
              text: "This code already exists.",
            },
          });
        } else {
          this.setState({
            code_validate: {
              value: code,
              status: "VALID",
              class: "is-valid",
              text: "",
            },
          });
        }
      }
    } else {
      this.setState({
        code_validate: { value: code, status: "", class: "", text: "" },
      });
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <Form onSubmit={this._handleSubmit.bind(this)}>
            <CardHeader className="header-t-red">
              เพิ่มตำแหน่งผู้ใช้งาน
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>รหัสตำแหน่ง </Label>
                    <Input
                      type="text"
                      id="user_position_code"
                      name="user_position_code"
                      value={this.state.user_position_code}
                      className={this.state.code_validate.class}
                      onChange={(e) =>
                        this.setState({ user_code: e.target.value })
                      }
                      onBlur={() => this._checkCode()}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label>
                      ชือตำแหน่ง{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </Label>
                    <Input
                      type="text"
                      id="user_position_name"
                      name="user_position_name"
                      value={this.state.user_position_name}
                      onChange={(e) =>
                        this.setState({ user_position_name: e.target.value })
                      }
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button type="submit" color="success">
                Save
              </Button> 
              <Link to="/user-position">
                <Button type="button" color="danger"> Back </Button>
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

export default connect(mapStatetoProps)(Insert);
