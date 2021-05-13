import React, { ReactText, useState } from 'react'
import '../style/Button.scss'

export interface ButtonProps {
    readonly children: ReactText
    readonly onClick?: () => void
    readonly color?: string
}

function Button ({ children, onClick, color }: ButtonProps) {
    const [className, setClassName] = useState<string[]>([])
    return (
        <p
            className={['button', ...className].join(' ')}
            onClick={() => {
                setClassName(['clicked']);
                setTimeout(setClassName, 200, ['unclicked'])
                setTimeout(setClassName, 400, [])
                if (onClick) onClick()
            }}
            style={
                color
                    ? { backgroundColor: color }
                    : undefined
            }
        >
            {children}
        </p>
    )
}

export default Button
