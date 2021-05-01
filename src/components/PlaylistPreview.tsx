import React from 'react'

import CoverImage from './CoverImage'

import './PlaylistPreview.scss'

interface PlaylistPreviewProps {
    name: string
    cover?: string
    handleClick?: React.MouseEventHandler<HTMLDivElement>
}

export default (props: PlaylistPreviewProps) => (
    <div className="playlist" onClick={props.handleClick}>
        <CoverImage src={props.cover} />
        <p>{props.name}</p>
    </div>
)
