import React from "react"
import './LoaderCircle.css'

export default function LoaderCircle () {
  return (
    <React.Fragment>
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    </React.Fragment>
  )
}