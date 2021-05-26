import ListItem, { Similarities } from './list-item'
import { requestWithURL } from '../spotify'



export default class TrackList extends Array<ListItem<TrackObject>> {
    [key: number]: ListItem<TrackObject>

    constructor(value: SimplifiedPlaylistObject['tracks'])
    constructor(info: PlaylistObject['tracks'])
    constructor(value: SimplifiedPlaylistObject['tracks'] |PlaylistObject['tracks']) {
        super(value.total)
        if ('items' in value) {
            value.items.forEach((item, i) => {
                this[i] = new ListItem(item)
            })
            if (value.next) this.tracksURL = value.next
        } else {
            this.tracksURL = value.href
        }
    }

    private loadIndex? = 0
    push(...items: ListItem<TrackObject>[]): number {
        if (this.loadIndex === undefined) return super.push(...items)
        items.forEach((item, i) => {
            this[this.loadIndex! + i] = item
        })
        this.loadIndex += items.length
        return this.loadIndex
    }

    private tracksURL?: PlaylistTracksRefObject['href']

    load(token: string) {
        type Params = [PlaylistObject['tracks']['href'] | null, PlaylistTrackObject[]]

        const addTracksAndGetNextUrl = (...[url, tracks]: Params): Promise<Params> => {
            return Promise.all([
                (url ? requestWithURL({
                        url: url,
                        method: 'GET',
                        token: token,
                    })
                    : null),
                new Promise((resolve: (value: number) => void) => {
                    return resolve(this.push(...tracks.map(track => new ListItem<TrackObject>(track))))
                })
            ]).then(([res]) => {
                if (res) return addTracksAndGetNextUrl(res.next, res.items)
                else return [res, []]
            })
        }
        
        return addTracksAndGetNextUrl(this.tracksURL!, []).finally(() => {
            delete this.tracksURL
            delete this.loadIndex
        })
    }

    splice(start: number, deleteCount?: number): ListItem<TrackObject>[] { 
        return super.splice(start, deleteCount)
    }
}