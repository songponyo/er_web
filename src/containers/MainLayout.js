// import { set } from 'core-js/fn/dict'
import React from 'react'
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

const MainLayout = () => { 
  function set(e) {
    console.log(e);
  }
  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader name={"head"} set={(e) => set(e)} />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  )
}

export default MainLayout
