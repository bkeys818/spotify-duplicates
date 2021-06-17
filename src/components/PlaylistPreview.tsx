import React from 'react'

import CoverImage from './CoverImage'

import '../style/PlaylistPreview.scss'

export interface PlaylistPreviewProps {
    name: string
    cover?: string | null
    handleClick?: React.MouseEventHandler<HTMLDivElement>
}

const PlaylistPreview = (props: PlaylistPreviewProps) => (
    <div className="playlist" onClick={props.handleClick}>
        <CoverImage src={props.cover} />
        <h6 className="title">{props.name}</h6>
    </div>
)
export default PlaylistPreview