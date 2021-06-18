import constructor, { staticConstructor } from './constructor'
import Item from './item'
import loadItems from './load-items'
import findDuplicates from './find-duplicates'
import type {
    SimplifiedPlaylistObject,
    PlaylistObject,
} from 'spotify-api-request/types/objects'

interface StaticPlaylist extends Pick<PlaylistObject, 'id' | 'name'> {
    readonly coverImage: string | null
    itemsInfo?: SimplifiedPlaylistObject['tracks']
}

interface Playlist extends StaticPlaylist {
    items: Item[]
}

const StaticPlaylist = {
    name: 'StaticPlaylist',
    new: staticConstructor
}

const Playlist = {
    name: 'Playlist',
    new: constructor,
    loadItems: loadItems,
    findDuplicates: findDuplicates
}

export { StaticPlaylist }
export default Playlist