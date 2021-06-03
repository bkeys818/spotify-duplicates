import React from 'react'
import { useSpring, animated, config } from 'react-spring'

export interface IndicatorSvgProps {
    state: IndicatorSvgState
    size?: number
    strokeWidth?: number
}

export default function IndicatorSvg(props: IndicatorSvgProps) {
    // const [rotation, setRotation] = useState(0)
    const styles = useSpring({
        config: { duration: 500 },
        ...animatedProps[props.state],
    })
    // const { rotate } = useSpring({
    //     config: { duration: 500 },
    //     rotate: `rotate(${rotation}deg)`
    // })
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-16 -16 32 32"
            width={props.size}
            height={props.size}
            className="symbol_indicator"
        >
            <title>indicator</title>
            <g
                fill="none"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5px"
            >
                {[styles.path1, styles.path2, styles.path3].map(path => (
                    <animated.path d={path} style={{
                        // color: styles.color
                    }}/>
                ))}
            </g>
        </svg>
    )
}

export type IndicatorSvgState = 'success' | 'error' | 'warn' | 'hamburger'

interface AnimatedProps {
    color: React.CSSProperties['color']
    path1: string
    path2: string
    path3: string
}

const animatedProps: {
    [key in IndicatorSvgState]: AnimatedProps
} = {
    success: {
        color: '',
        path1: 'M -14,0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0',
        path2: 'm-2,7 9,-11',
        path3: 'm-8,1 6,6',
    },
    error: {
        color: '',
        path1: 'M -14,0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0',
        path2: 'm-6,-6 12,12',
        path3: 'm-6,6 12,-12',
    },
    warn: {
        color: '',
        path1: 'M -14,0 a 14,14 0 1,0 28,0 a 14,14 0 1,0 -28,0',
        path2: 'm0,3 0,-11',
        path3: 'm0,7 0,1',
    },
    hamburger: {
        color: '',
        path1: 'm -8,0 a 8,0 0 1,0 16,0 a 8,0 0 1,0 -16,0',
        path2: 'm-8,-6 16 0',
        path3: 'm-8,6 16 0'
    }
}

function circleToPath(cx: number, cy: number, r: number) {
    return `
        M ${cx - r}, ${cy}
        a ${r},${r} 0 1,0 ${r * 2},0
        a ${r},${r} 0 1,0 ${-(r * 2)},0
    `
}