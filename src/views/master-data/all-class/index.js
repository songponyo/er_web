import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Register = React.lazy(() => import('./register'))
const Update = React.lazy(() => import('./update'))

class Allclass extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route exact path="/all-class/insert" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/all-class/update/:code" render={props => <Update {...props} {...this.props.SESSION}/>}  />
            <Route path="/all-class" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Allclass