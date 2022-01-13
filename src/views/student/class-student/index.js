import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Update = React.lazy(() => import('./update'))
const Detail = React.lazy(() => import('./detail')) 
const News = React.lazy(() => import('./news'))

class Classstudent extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route exact path="/class-student/insert" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-student/update/:code" render={props => <Update {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-student/detail/:code" render={props => <Detail {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-student/news/:code" render={props => <News {...props} {...this.props.SESSION}/>}  />
            <Route path="/class-student" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Classstudent