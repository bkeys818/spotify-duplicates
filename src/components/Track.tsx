import React, { useState } from 'react'
import { useSpring, animated, SpringValue } from 'react-spring'
import DuplicateStatus from '../assets/DuplicateStatus'
import Playlist from '../../utils/playlist'
import type { CurrentAction } from '../pages/playlist-view'

import '../style/Track.scss'

export type TrackProps = Playlist['items'][number] & {
    currentAction: CurrentAction
}
const defaultHeight = 42

export default function Track({
    track,
    duplicates,
    currentAction,
}: TrackProps) {
    let mainSymbol: JSX.Element | undefined
    // let duplicateSymbol
    let height: number | SpringValue<number> = defaultHeight

    if (currentAction == 'findDuplicates' && duplicates.length > 0) {
        const [isExpanded, setIsExpanded] = useState(false)
        height = useSpring({
            height: isExpanded
                ? defaultHeight * (duplicates.length + 1)
                : defaultHeight,
        }).height

        mainSymbol = (
            <DuplicateStatus
                status={
                    duplicates.some(
                        duplicate => duplicate.similarities == ['identical']
                    )
                        ? 'error'
                        : 'warn'
                }
                onClick={() => { setIsExpanded(!isExpanded) }}
            />
        )
    }

    return (
        <animated.div
            id={track.id}
            className="track"
            style={{ height: height }}
        >
            {/* main track */}
            <TrackItem
                track={track}
                className="main"
                key="main"
                style={{ zIndex: duplicates.length }}
                symbol={mainSymbol}
            />
            {/* duplicate tracks */}
            {duplicates.map<JSX.Element>((duplicate, i) => (
                <TrackItem
                    track={duplicate.track}
                    className="duplicate"
                    key={duplicate.track.id + '-' + i}
                    style={{
                        zIndex: duplicates.length - 1 - i,
                        top: `calc((100% - ${defaultHeight}px) * ${i + 1} / ${
                            duplicates.length
                        })`,
                    }}
                    // symbol={
                    //     <p className="tag">
                    //         {duplicate.similarities?.join(', ')}
                    //     </p>
                    // }
                />
            ))}
        </animated.div>
    )
}

interface TrackItemProps {
    track: TrackProps['track']
    className: string
    style?: React.CSSProperties
    symbol?: JSX.Element
}

const TrackItem = ({ track, className, style, symbol }: TrackItemProps) => (
    <div className={className} style={style}>
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
