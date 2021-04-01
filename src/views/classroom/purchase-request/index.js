import React from "react"
import { HashRouter, Route, Switch } from "react-router-dom"

const View = React.lazy(() => import("./view"));
const Insert = React.lazy(() => import("./insert"))
const Revise = React.lazy(() => import('./revise'))
const Update = React.lazy(() => import('./update'))
const Detail = React.lazy(() => import('./detail'))

class PurchaseRequest extends React.Component {
  render() {
    const { permission_add, permission_edit, } = this.props.SESSION.PERMISSION

    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            {permission_add ? <Route exact path="/purchase-request/insert" render={props => <Insert {...props} {...this.props.SESSION} />} /> : null}
            {permission_add ? <Route exact path="/purchase-request/revise/:code" render={props => <Revise {...props} {...this.props.SESSION} />} /> : null}
            {permission_edit ? <Route exact path="/purchase-request/update/:code" render={props => <Update {...props} {...this.props.SESSION} />} /> : null}
            <Route exact path="/purchase-request/detail/:code" render={props => <Detail {...props} {...this.props.SESSION} />} />
            <Route path="/purchase-request" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );

  }
}

export default PurchaseRequest