import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button
} from 'reactstrap'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import { Loading, Table, } from '../../../component/revel-strap'

import UserPositionModel from '../../../models/UserPositionModel'

const user_position_model = new UserPositionModel()

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showloading: true,
      user_positions: [],
    }
  }

  componentDidMount() {

    this._fetchData()
  }

  _fetchData(params = { pagination: { current: 1, pageSize: 20 } }) {
    this.setState({
      showloading: true,
    }, async () => {
      const user_positions = await user_position_model.getUserPositionBy({
        params: params,
      })

      this.setState({
        showloading: false,
        user_positions: user_positions,
      })
    })
  }

  _onDelete(code) {
    Swal.fire({
      title: "Are you sure ?",
      text: "Confirm to delete this item",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.setState({
          showloading: true,
        }, async () => {
          user_position_model.deleteUserPositionByCode({ user_position_code: code }).then((res) => {
            if (res.require) {
              Swal.fire('Success Deleted!', '', 'success')
              this._fetchData()
            } else {
              this.setState({ showloading: false })
              Swal.fire('Sorry, Someting worng !', '', 'error')
            }
          })
        })
      }
    })
  }

  render() {
    
    const { permission_add, permission_edit, permission_delete, } = this.props.PERMISSION

    return (
      <div className="animated fadeIn">
        <Loading showloading={this.state.showloading} />
        <Card>
        <CardHeader className="header-t-red">
            จัดการตำแหน่งพนักงาน / Employee Position
            {permission_add ?
              <Link to={`/user-position/insert`} className="btn btn-success float-right">
                <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มตำแหน่ง
              </Link> : null
            }
          </CardHeader>
          <CardBody>
            <Table
              onChange={(e) => this._fetchData(e)}
              showRowNo={true}
              dataSource={this.state.user_positions.data}
              dataTotal={this.state.user_positions.total}
              rowKey='user_position_code'
              columns={[
                {
                  title: "รหัสตำแหน่ง",
                  dataIndex: "user_position_code",
                  filterAble: true,
                  ellipsis: true,
                  width: 250,
                },
                {
                  title: "ตำแหน่ง ",
                  dataIndex: "user_position_name",
                  filterAble: true,
                  ellipsis: true,
                },
                {
                  title: "เมนู", 
                  align: "center",
                  render: (cell) => {
                    const row_accessible = []

                    if (permission_edit) {
                      row_accessible.push(
                        <Link key="update" to={`/user-position/update/${cell.user_position_code}`} title="แก้ไขรายการ">
                          <button type="button" className="btn btn-warning btn-row-sm">
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                          </button>
                        </Link>
                      )
                    }
                    if (permission_delete) {
                      row_accessible.push(
                        <button key="delete" type="button" className="btn btn-danger btn-row-sm" onClick={() => this._onDelete(cell.user_position_code)} title="ลบรายการ">
                          <i className="fa fa-remove" aria-hidden="true"></i>
                        </button>
                      )
                    }

                    return row_accessible
                  },
                  width: 80
                },
              ]}
            />
          </CardBody>
          <CardFooter>
            <Link to="/user"><Button color="btn btn-default">Back</Button></Link>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

export default View