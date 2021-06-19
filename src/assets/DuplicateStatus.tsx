import React from 'react'
import { useTransition, animated } from 'react-spring'

export interface DuplicateStatusProps {
    status: 'error' | 'warn'
    size?: number
    strokeWidth?: number
    onClick?: () => void
}

export default function DuplicateStatus(props: DuplicateStatusProps) {
    const transition = useTransition(props.status, {
        from: {
            opacity: 0,
            transform: 'scale(0)',
        },
        enter: {
            opacity: 1,
            transform: 'scale(1)',
        },
        leave: {
            opacity: 0,
            transform: 'scale(0)',
        },
    })

    return transition((styles, status) => (
        <animated.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-16 -16 32 32"
            width={props.size}
            height={props.size}
            className="symbol_indicator"
            onClick={props.onClick}
            {...styles}
        >
            <title>indicator</title>
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5px"
            >
                <path d="M -14,0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0" />
                <path d={status == 'error' ? 'm-6,-6 12,12' : 'm0,3 0,-11'} />
                <path d={status == 'error' ? 'm-6,6 12,-12' : 'm0,7 0,1'} />
            </g>
        </animated.svg>
    ))
}
