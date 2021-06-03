import React, { useState } from 'react'
import { useSpring, animated, config, SpringConfig } from 'react-spring'
import IndicatorSvg from '../assets/IndicatorSvg'
import Playlist from '../../utils/playlist'

import '../style/Track.scss'

export type TrackProps = Playlist['items'][number]
const defaultHeight = 42

export default function Track({ track, duplicates, icon }: TrackProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const { height } = useSpring({
        height:  isExpanded ? defaultHeight * (duplicates.length + 1) : defaultHeight,
    })

    // const [trackHeight, setTrackHeight] = useState(rowHeight)

    const expandsDuplicateTracks = (old: typeof isExpanded) => {
        setIsExpanded(!old)
    }

    const [symbolFunc, setSymbolFunc] = useState(() => {
        return expandsDuplicateTracks
    })

    return (
        <animated.div className="track" style={{ height: height }} >

            <TrackItem
                track={track}
                className="main"
                key="main"
                style={{ zIndex: duplicates.length, }}
                symbol={
                    <IndicatorSvg
                        state={icon ?? 'hamburger'}
                        size={32}
                        onClick={() => { symbolFunc(isExpanded) }}
                    />
                }
            />

            {duplicates.map<JSX.Element>((duplicate, i) => (
                <TrackItem
                    track={duplicate.track}
                    className="duplicate"
                    key={duplicate.track.id}
                    style={{
                        zIndex: duplicates.length - 1 - i,
                        top: `calc((100% - ${defaultHeight}px) * ${i+1} / ${duplicates.length})`
                    }}
                    symbol={
                        <p className="tag">{duplicate.similarities?.join(', ')}</p>
                    }
                />
            ))}
        </animated.div>
    )
}

interface TrackItemProps {
    track: TrackProps['track'],
    className: string
    style?: React.CSSProperties
    symbol: JSX.Element
}

const TrackItem = ({ track, className, style, symbol}: TrackItemProps) => (
    <div className={className} style={style} >
        <p className="name clip-text_one-line_ellipsis ">{track.name}</p>
        <p className="artists clip-text_one-line_ellipsis body2">
            {track.artists.map(artist => artist.name).join(', ')}
        </p>
        <p className="album clip-text_one-line_ellipsis body2">
            {track.album.name}
        </p>
        {symbol}
    </div>
)

const TrackInfo = ({name, artists, album}: TrackProps['track']) => [
    <p key="name" className="name clip-text_one-line_ellipsis ">{name}</p>,
    <p key="artists" className="artists clip-text_one-line_ellipsis body2">
        {artists.map(artist => artist.name).join(', ')}
    </p>,
    <p key="album" className="album clip-text_one-line_ellipsis body2">
        {album.name}
    </p>
]