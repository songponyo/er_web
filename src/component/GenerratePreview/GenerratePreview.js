import React from 'react'
import {
  Table,
} from 'reactstrap'
import paper_a from '../../assets/a.png'
export default class GenerratePreview {

  generratePreviewPlate(state) {
    let {
      print_direction_code,
      print_direction_deg,
      print_direction_type,
      customer_purchase_order_detail_AR,
      customer_purchase_order_detail_AC,
      customer_purchase_order_detail_width,
      customer_purchase_order_detail_height,
      up_ac,
      up_ar,
      ar,
      ac
    } = state

    console.log("state : = > ", state);
    var render_data = []
    //******** begin define lay out *********//
    const color_data = {
      paper_manage: '#cecece',
      paper_machine: '#66c2ff',
      margin: '#ffff33',
      grip: '#ffb3b3',
    }

    const max = {
      width: 600,
      height: 480,
    }

    //******** end define lay out *********//

    if (print_direction_code !== undefined && print_direction_code !== "") {
      // if (state.paper_machine_lay.frame !== undefined) {
      // const frame = state.paper_machine_lay.frame;
      // const lay_out = state.paper_machine_lay.lay_out;
      const frame = {
        height: ac,
        width: ar
      };
      const lay_out = {
        margin: {
          margin_x: 0,
          margin_y: 0,
          margin_left: 0,
          margin_right: 0,
          margin_top: 0,
          margin_bottom: 0,

        },
        grip: {
          grip_x: 0,
          grip_y: 0
        },
        ley_margin_bottom: 0,
        ley_margin_right: 0,
        ley_y: up_ac,
        ley_x: up_ar,
        width: customer_purchase_order_detail_width,
        height: customer_purchase_order_detail_height
      };
      let direction_type = print_direction_type == "out" ? "ม้วนออกด้านนอก" : print_direction_type == "in" ? "ม้วนออกด้านใน" : "";

      //******** begin pixel value *********//

      if (Object.keys(frame).length && Object.keys(lay_out).length) {

        var preview_ratio = 0;
        var display_column = [];
        var margin_top = 0;
        var margin_bottom = 0;
        var margin_left = 0;
        var margin_right = 0;
        frame.height > frame.width ? preview_ratio = max.height / frame.height : preview_ratio = max.width / frame.width;

        var paper_machine_px = {
          width: frame.width * preview_ratio,
          height: frame.height * preview_ratio,
        }
        console.log("lay_out : ", lay_out);
        var paper_manage_px = {
          width: lay_out.width * preview_ratio,
          height: lay_out.height * preview_ratio,
          margin_x: this._ignoreDecimal(lay_out.margin.margin_x * preview_ratio),
          margin_y: this._ignoreDecimal(lay_out.margin.margin_y * preview_ratio),
          margin_left: this._ignoreDecimal(lay_out.margin.margin_left * preview_ratio),
          margin_right: this._ignoreDecimal(lay_out.margin.margin_right * preview_ratio),
          margin_top: this._ignoreDecimal(lay_out.margin.margin_top * preview_ratio),
          margin_bottom: this._ignoreDecimal(lay_out.margin.margin_bottom * preview_ratio),
          ley_margin_bottom: this._ignoreDecimal(lay_out.ley_margin_bottom * preview_ratio),
          ley_margin_right: this._ignoreDecimal(lay_out.ley_margin_right * preview_ratio),
        };

        var grip_px = {
          grip_x: this._ignoreDecimal(lay_out.grip.grip_x * preview_ratio),
          grip_y: this._ignoreDecimal(lay_out.grip.grip_y * preview_ratio),
        };
        var paddingLeft = (paper_machine_px.height > paper_machine_px.width ? grip_px.grip_x : 0)
        var paddingTop = (paper_machine_px.height < paper_machine_px.width ? grip_px.grip_x : 0)



        if (lay_out.rotate_qty) {
          paper_manage_px.rotate_margin_top = this._ignoreDecimal(lay_out.rotate_margin_top * preview_ratio);
          paper_manage_px.rotate_margin_left = this._ignoreDecimal(lay_out.rotate_margin_left * preview_ratio);
        }
        //******** end pixel value *********//


        //******** begin render ley *********//
        var display_ley = [];
        for (let y = 0; y < lay_out.ley_y; y++) {

          display_column = [];
          margin_top = paper_manage_px.margin_top;
          margin_bottom = 0;

          if (y !== 0) margin_top = paper_manage_px.margin_y;
          if (y + 1 === lay_out.ley_y) margin_bottom = paper_manage_px.ley_margin_bottom;

          for (let x = 0; x < lay_out.ley_x; x++) {
            margin_left = paper_manage_px.margin_left;
            margin_right = 0;

            if (x !== 0) margin_left = paper_manage_px.margin_x;
            if (x + 1 === lay_out.ley_x) margin_right = paper_manage_px.ley_margin_right;

            display_column.push(
              <td key={x}
                style={{
                  borderTop: 'unset',
                  backgroundColor: color_data.margin,
                  paddingLeft: margin_left,
                  paddingRight: margin_right,
                  paddingTop: margin_top,
                  paddingBottom: margin_bottom,
                  // border: '2px solid #ffff33',
                  outline: '1px dashed #fff',
                  outlineOffset: '-6px'
                }}
              >
                <div style={{ height: paper_manage_px.height, width: paper_manage_px.width, backgroundColor: color_data.paper_machine, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* <img src={paper_a} style={{ height: '100%', width: '100%', }} /> */}
                  <p style={{
                    fontSize: paper_manage_px.height * 0.4,
                    margin: 0,
                    color: "#ffffff",
                    transform: `rotate(${print_direction_deg}deg)`
                  }}>A</p>
                </div>
              </td >
            )
          }
          display_ley.push(<tr key={y}>{display_column}</tr>)
        }
        //******** end render ley *********//

        //******** begin render rotate *********//
        var display_rotate_x = [];
        var display_rotate_y = [];

        if (lay_out.rotate_qty) {
          for (let y = 0; y < lay_out.rotate_y; y++) {
            display_column = [];
            margin_top = paper_manage_px.margin_y;
            margin_bottom = 0;

            if (y === 0) margin_top = paper_manage_px.rotate_margin_top;
            if (y + 1 === lay_out.rotate_y) margin_bottom = paper_manage_px.margin_bottom;

            for (let x = 0; x < lay_out.rotate_x; x++) {
              margin_left = paper_manage_px.margin_x;
              margin_right = 0;

              if (x === 0) margin_left = paper_manage_px.rotate_margin_left;
              if (x + 1 === lay_out.rotate_x) margin_right = paper_manage_px.margin_right;

              display_column.push(
                <td key={x}
                  style={{
                    borderTop: 'unset',
                    backgroundColor: color_data.margin,
                    paddingLeft: margin_left,
                    paddingRight: margin_right,
                    paddingTop: margin_top,
                    paddingBottom: margin_bottom,
                    // border: '2px solid #ffff33',
                    outline: '1px dashed #fff',
                    outlineOffset: '-6px'
                  }}
                >
                  <div style={{ height: paper_manage_px.width, width: paper_manage_px.height, backgroundColor: color_data.paper_machine, }}></div>
                </td>
              )
            }

            if (lay_out.rotate_axis === 'x') {
              display_rotate_x.push(<tr key={y}>{display_column}</tr>)
            } else if (lay_out.rotate_axis === 'y') {
              display_rotate_y.push(<tr key={y}>{display_column}</tr>)
            }
          }
        }
        //******** end render rotate *********//
        render_data.push(
          <Table key={`preview_page`} id="preview_page" style={{ margin: 'auto', width: 'max-content', alignSelf: 'center', }}>
            <tbody>
              <tr>
                <td colSpan="2" style={{ borderTop: 'unset', padding: 'unset', }}>
                </td>
                <td colSpan="1"
                  style={{
                    borderTop: 'unset',
                    padding: 'unset',

                    textAlign: 'center'
                  }}>
                  {direction_type}
                </td>
              </tr>
              <tr>
                <td colSpan="2" style={{ borderTop: 'unset', padding: 'unset', }}>
                </td>
                <td colSpan="1"
                  style={{
                    borderTop: 'unset',
                    padding: 'unset',
                    paddingLeft: "50%"
                    // textAlign: 'center'
                  }}>
                  <i class="icono-arrow2-left"></i>
                </td>
              </tr>
              <tr>
                {/* <td style={{ borderTop: 'unset', padding: 'unset', }}></td> */}
                <td colSpan="2" style={{ borderTop: 'unset', padding: 'unset', }}></td>
                <td style={{ textAlign: "center", borderTop: 'unset', padding: 'unset', paddingBottom: 8, }}>
                  {`${frame.height} mm.`}
                  <div style={{ border: '1px solid #000', borderBottom: 'unset', paddingBottom: 8, }}></div>
                </td>

              </tr>
              <tr>
                {/* <td style={{ borderTop: 'unset', padding: 'unset', }}><i class="icono-arrow2-up"></i></td> */}
                <td style={{ borderTop: 'unset', padding: 'unset', paddingRight: 8, verticalAlign: 'middle', }}>
                  {`${frame.width} mm.`}
                </td>
                <td style={{ borderTop: 'unset', padding: 'unset', paddingRight: 8, }}>
                  <div style={{ height: paper_machine_px.height, width: 8, border: '1px solid #000', borderRight: 'unset', }}></div>
                </td>

                <td style={{ borderTop: 'unset', padding: 'unset', }}>
                  <div
                    style={{
                      height: paper_machine_px.height,
                      width: paper_machine_px.width,
                      paddingLeft: paddingLeft,
                      paddingRight: 0,
                      paddingTop: paddingTop,
                      paddingBottom: 0,
                      backgroundColor: color_data.grip,
                      margin: 'auto',
                    }}
                  >
                    <div id="div-paper_machine"
                      style={{
                        height: (paper_machine_px.height < paper_machine_px.width ? (paper_machine_px.height - (grip_px.grip_x + grip_px.grip_y)) : paper_machine_px.height),
                        width: (paper_machine_px.width < paper_machine_px.height ? (paper_machine_px.width - (grip_px.grip_x + grip_px.grip_y)) : paper_machine_px.width),
                        backgroundColor: color_data.paper_manage,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Table style={{ marginBottom: 0, width: 'max-content', }}>
                        <tbody>
                          <tr>
                            <td style={{ borderTop: 'unset', padding: 'unset', }}>
                              <Table style={{ marginBottom: 0, width: 'max-content', }}>
                                <tbody>
                                  {display_ley}
                                </tbody>
                              </Table>
                            </td>
                            <td style={{ borderTop: 'unset', padding: 'unset', }}>
                              <Table style={{ marginBottom: 0, width: 'max-content', }}>
                                <tbody>
                                  {display_rotate_x}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2" style={{ borderTop: 'unset', padding: 'unset', }}>
                              <Table style={{ marginBottom: 0, width: 'max-content', }}>
                                <tbody>
                                  {display_rotate_y}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table >
        )
      }
      // }
    }

    return render_data
  }

  _ignoreDecimal(val) {
    var decimal = val.toString().split('.')
    isNaN(val) ? decimal = 0 : decimal = parseInt(decimal[0])
    return decimal
  }
}