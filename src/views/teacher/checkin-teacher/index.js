import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Update = React.lazy(() => import('./update'))
const Detail = React.lazy(() => import('./detail'))
const Qrcode = React.lazy(() => import('./qrcode'))
const History = React.lazy(()=> import('./history'))

class Checkinteacher extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route exact path="/checkin-teacher/insert" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/checkin-teacher/update/:code" render={props => <Update {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/checkin-teacher/detail/:code" render={props => <Detail {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/checkin-teacher/qrcode/:code" render={props => <Qrcode {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/checkin-teacher/history/:code" render={props => <History {...props} {...this.props.SESSION}/>}  />
            <Route path="/checkin-teacher" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Checkinteacher