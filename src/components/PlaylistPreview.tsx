import React from 'react'

import CoverImage from './CoverImage'

import '../style/PlaylistPreview.scss'

interface PlaylistPreviewProps {
    name: string
    cover?: string
    handleClick?: React.MouseEventHandler<HTMLDivElement>
}

const PlaylistPreview = (props: PlaylistPreviewProps) => (
    <div className="playlist" onClick={props.handleClick}>
        <CoverImage src={props.cover} />
        <h6>{props.name}</h6>
    </div>
)
export default PlaylistPreview