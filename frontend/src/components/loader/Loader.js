import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './Loader.scss'

const Loader = () => {
  const [display, setDisplay] = useState(false)
  const visible = useSelector(state => state.loader.visible)
  const latency = useSelector(state => state.loader.latency)


  useEffect( () => {
    if(visible) {
      setDisplay(true)
    } else {
      setTimeout( () => setDisplay(false), latency)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if(!display) {
    return null
  }

  return (
    <div 
      className="loader" 
      data-visible={visible.toString()}
    >
      <div className="lds-default">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
        <span className="telegram"></span>
      </div>
    </div>
  )
}

export default Loader
