import React from "react"
import './LoaderCircle.css'

export default function LoaderCircle () {
  return (
    <React.Fragment>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </React.Fragment>
  )
}