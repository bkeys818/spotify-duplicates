import type { IndicatorSvgState } from '../../src/assets/state-svg'
import type { Similarities } from './find-duplicates'

interface Item extends Pick<PlaylistTrackObject, 'added_at'> {
    track: ItemTrack
    duplicates: Item[]
    icon?: IndicatorSvgState
    similarities?: Exclude<Similarities, 0>
}
interface Track {
    album: Pick<TrackObject['album'], 'id' | 'name'>
    artists: Pick<TrackObject['artists'][number], 'id' | 'name'>[]
}
// interface Episode
type ItemTrack = Pick<PlaylistTrackObject['track'], 'name' | 'id' | 'type'> & (Track /* | Epsiode */)

const Item = {
    new(value: PlaylistTrackObject): Item {
        return {
            added_at: value.added_at,
            track: (({ id, name, type, album, artists }) => ({
                id,
                name,
                type,
                album: (({ id, name }) => ({ id, name }))(album),
                artists: artists.map(({ id, name }) => ({ id, name }))
           }))(value.track),
           duplicates: [],
        }
    }
}

export default Item