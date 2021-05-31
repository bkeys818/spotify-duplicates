import React from 'react'
import Track from './Track'

import Playlist from '../../utils/playlist'

interface TrackListProps {
    items: Playlist['items']
}

export default function TrackList({ items }: TrackListProps) {
    const keyDuplicates: { [key: string]: number } = {}
    const tracks: JSX.Element[] = []
    for (const item of items) {
        if (item) {
            let key = item.track.id
            if (tracks.map(elem => elem.key).includes(key)) {
                if (keyDuplicates[key]) keyDuplicates[key] ++
                else keyDuplicates[key] = 1
                key += '-' + keyDuplicates[key]
            }
            tracks.push(<Track {...item} key={key} />)
        }
    }

    return (
        <div id="track-list">
            {tracks}
        </div>
    )
}