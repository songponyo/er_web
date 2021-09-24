import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Grouplist = React.lazy(() => import('./grouplist'))
const Insert = React.lazy(() => import('./insert'))
const Update = React.lazy(() => import('./update'))
const Excel = React.lazy(() => import('./excel'))
const Detail = React.lazy(() => import('./detail'))
const Score = React.lazy(() => import('./score'))
const Adduser = React.lazy(() => import('./adduser'))


class Classgroup extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
          <Route exact path="/class-group/insert/" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
          <Route exact path="/class-group/adduser/" render={props => <Adduser {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-group/grouplist" render={props => <Grouplist {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-group/update/:code" render={props => <Update {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-group/detail/:code" render={props => <Detail {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-group/excel/:code" render={props => <Excel {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/class-group/score/:code" render={props => <Score {...props} {...this.props.SESSION}/>}  />
            <Route path="/class-group" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Classgroup