import React from "react"

import "./Modal.scss"

interface ModalProps {
    handleClose: React.MouseEventHandler<HTMLDivElement>
}

export default (props: ModalProps) =>
    <div className="modal" onClick={props.handleClose}>
    </div>