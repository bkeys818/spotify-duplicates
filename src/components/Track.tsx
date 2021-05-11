import React from 'react'

import '../style/Track.scss'

export interface TrackProps {
    title: string
    artist: string
    album: string
    id?: string
}

const Track = (props: TrackProps) => {
    const { title, artist, album, id } = props
    return (
        <div className="track" id={id}>
            <p className="title clip-text_one-line_ellipsis">{title}</p>
            <p className="artist body2 clip-text_one-line_ellipsis">{artist}</p>
            <p className="album body2 clip-text_one-line_ellipsis">{album}</p>
        </div>
    )
}
export default Track
