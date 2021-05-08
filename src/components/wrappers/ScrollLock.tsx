import React from 'react'

export default (props: { children: React.ReactNode }) => (
    <div className="playlist-container">
        {props.children}
    </div>
)