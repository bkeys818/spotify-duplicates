import React from "react"

import "../style/Track.scss"

interface SongInfo {
    title: string
    artist: string
    album: string
}

export interface TrackProps {
    title: string
    artist: string
    album: string
}

const Track = (props: TrackProps) => {
    const { title, artist, album } = props;
    return (
        <div className="track">
            <p>{title}</p>
            <p>{artist}</p>
            <p>{album}</p>
        </div>
    );
}
export default Track