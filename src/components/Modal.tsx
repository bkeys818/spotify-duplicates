import React from 'react'
import { CSSTransition } from 'react-transition-group'

import './Modal.scss'

interface ModalProps {
    active: boolean
    handleClose: React.MouseEventHandler<HTMLDivElement>
    // playlist: SimplifiedPlaylistObject
}

const className = 'modal'
export default (props: ModalProps) => (
    <CSSTransition classNames={className} in={props.active} timeout={500}>
        <div className={className} onClick={props.handleClose}></div>
    </CSSTransition>
)
