import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Update = React.lazy(() => import('./update'))
const Detail = React.lazy(() => import('./detail'))

class Leaveform extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route exact path="/leave-form/insert" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/leave-form/update/:code" render={props => <Update {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/leave-form/detail/:code" render={props => <Detail {...props} {...this.props.SESSION}/>}  />
            <Route path="/leave-form" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Leaveform