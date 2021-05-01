import React from "react"

import "./Track.scss"

interface SongInfo {
    name: string
    artist: string
    album: string
}

export interface TrackProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    song: SongInfo
    symbolLeft?: JSX.Element
    symbolRight?: JSX.Element
}

export default (props: TrackProps) => {
    const { song, symbolLeft, symbolRight, ...divProps } = props;
    divProps.className = "track " + (divProps.className ?? "");
    return (
        <div {...divProps} >
            {symbolLeft}
            <p className="name">{song.name}</p>
            <p className="album">{song.album}</p>
            <p className="artist">{song.artist}</p>
            {symbolRight}
        </div>
    );
}