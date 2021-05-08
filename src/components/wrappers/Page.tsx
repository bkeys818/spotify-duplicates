import React, { useState, ReactNode } from 'react'

import { CSSTransition } from 'react-transition-group'
import '../../style/Page.scss'

interface PageProps {
    children: ReactNode
}
interface PageWithAnimationProps extends PageProps {
    children: ReactNode
    layer: number
    in: boolean
}

export default function Page(props: PageProps | PageWithAnimationProps) {
    const page = (style?: React.CSSProperties) => (
        <div className={'page-container' + (style ? '' : ' main')} style={style}>
            {props.children}
        </div>
    )
    if ('layer' in props) {
        return (
            <CSSTransition
                in={props.in}
                timeout={350}
                classNames="slide"
                appear={true}
            >
                {page({ zIndex: props.layer })}
            </CSSTransition>
        )
    }
    return page()
}
