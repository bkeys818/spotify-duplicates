import type { IndicatorSvgState } from '../../src/assets/IndicatorSvg'
import type { Similarities } from './find-duplicates'
import type {
    PlaylistTrackObject,
    TrackObject,
} from 'spotify-api-request/types/objects'

interface Item extends Pick<PlaylistTrackObject, 'added_at'> {
    track: ItemTrack
    duplicates: Item[]
    similarities?: Similarities
}
interface Track {
    album: Pick<TrackObject['album'], 'id' | 'name'>
    artists: Pick<TrackObject['artists'][number], 'id' | 'name'>[]
}
// interface Episode
type ItemTrack = Pick<PlaylistTrackObject['track'], 'name' | 'id' | 'type'> & (Track /* | Epsiode */)

function newItem(value: PlaylistTrackObject): Item
function newItem(value: TrackObject): Item
function newItem(value: PlaylistTrackObject | TrackObject): Item {
    return {
        added_at: 'added_at' in value ? value.added_at : null,
        track: (({ id, name, type, album, artists }) => ({
            id,
            name,
            type,
            album: (({ id, name }) => ({ id, name }))(album),
            artists: artists.map(({ id, name }) => ({ id, name }))
        }))('added_at' in value ? value.track : value),
        duplicates: [],
    }
}

const Item = {
    new: newItem
}

export default Item