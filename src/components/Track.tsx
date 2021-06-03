import React from 'react'
import IndicatorSvg from '../assets/IndicatorSvg'
import Playlist from '../../utils/playlist'

import '../style/Track.scss'

export type TrackProps = Playlist['items'][number]

export default function Track(props: TrackProps) {
    const duplicates: JSX.Element[] = []
    for (const duplicate of props.duplicates) {
        duplicates.push(
            <div key={duplicate.track.id}>
                {TrackInfo(duplicate.track)}
                <p className="tag">{duplicate.similarities?.join(', ')}</p>
            </div>
        )
    }
    
    return (
        <div className="track">
            <div className="main">
                {TrackInfo(props.track)}
                <IndicatorSvg state={props.icon ?? "hamburger"} size={32} />
            </div>
            {props.duplicates.length > 0 && (
                <div className="duplicates">{duplicates}</div>
            )}
        </div>
    )
}

const TrackInfo = ({ name, album, artists }: TrackProps['track']) => [
    <p key="name" className="name clip-text_one-line_ellipsis ">{name}</p>,
    <p key="artists" className="artists clip-text_one-line_ellipsis body2">
        {artists.map(artist => artist.name).join(', ')}
    </p>,
    <p key="album" className="album clip-text_one-line_ellipsis body2">{album.name}</p>
]