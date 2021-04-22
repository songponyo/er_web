import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Update = React.lazy(() => import('./update'))

class Classgroup extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route exact path="/class-group/insert" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-group/update/:code" render={props => <Update {...props} {...this.props.SESSION}/>}  />
            <Route path="/class-group" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Classgroup