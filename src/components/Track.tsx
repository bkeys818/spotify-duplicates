import React from 'react'
import IndicatorSvg from '../assets/IndicatorSvg'
import Playlist from '../../utils/playlist'

import '../style/Track.scss'

export type TrackProps = Playlist['items'][number]

export default function Track(props: TrackProps) {
    return (
        <div className="track">
            <MainTrackInfo {...props}/>
            {props.duplicates.length > 0 && (
                <div className="duplicates">
                    {props.duplicates.map(duplicate => (
                        <DuplicateTrackInfo key={duplicate.track.id} {...props}/>
                    ))}
                </div>
            )}
        </div>
    )
}

const MainTrackInfo = ({ track, icon }: TrackProps) => (
    <div className="main">
        <p className="name clip-text_one-line_ellipsis ">{track.name}</p>
        <p className="artists clip-text_one-line_ellipsis body2">
            {track.artists.map(artist => artist.name).join(', ')}
        </p>
        <p className="album clip-text_one-line_ellipsis body2">{track.album.name}</p>
        {icon && <IndicatorSvg state={icon} size={32} />}
    </div>
)

const DuplicateTrackInfo = ({ track, similarities }: TrackProps) => (
    <div className="duplicate">
        <p className="name clip-text_one-line_ellipsis ">{track.name}</p>
        <p className="artists clip-text_one-line_ellipsis body2">
            {track.artists.map(artist => artist.name).join(', ')}
        </p>
        <p className="album clip-text_one-line_ellipsis body2">{track.album.name}</p>
        <p className="tag">{similarities?.join(', ')}</p>
    </div>
)
