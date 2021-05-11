import React, { ReactText } from 'react'

interface ButtonProps {
    readonly children: ReactText
    readonly onClick?: () => void
    readonly color?: string
}

const buttonSyle: React.HTMLAttributes<HTMLParagraphElement>['style'] = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '.8em',
    padding: '.48em 1em .45em',
    whiteSpace: 'nowrap'
}

// display: inline-flex;
// justify-content: center; /* center the content horizontally */
// align-items: center; /* center the content vertically */

const Button = ({ children, onClick, color }: ButtonProps) => (
    <p
        className="button"
        onClick={onClick}
        style={{
            ...buttonSyle,
            backgroundColor: color ?? '#D3D3D3',
        }}
    >
        {children}
    </p>
)

export default Button
