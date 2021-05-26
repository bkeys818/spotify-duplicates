import { filterImages } from './constructor'
import ListItem from './list-item'

import { requestWithURL } from '../spotify'

interface StaticPlaylistProps {
    readonly id: string
    readonly name: string
    readonly coverImage: string | null
    readonly tracks: SimplifiedPlaylistObject['tracks']
}

export default class Playlist {
    private readonly id: string
    readonly name: string
    readonly coverImage: string | null
    readonly items: ListItem<TrackObject>[]

    constructor(value: SimplifiedPlaylistObject)
    constructor(value: PlaylistObject)

    constructor(value: SimplifiedPlaylistObject | PlaylistObject) {
        this.id = value.id
        this.name = value.name
        this.coverImage = filterImages(value.images)

        this.items = new Array(value.tracks.total)

        if ('items' in value.tracks) {
            value.tracks.items.forEach((item, i) => {
                this.items[i] = new ListItem(item)
            })
            if (value.tracks.next) this.tracksURL = value.tracks.next
        } else {
            this.tracksURL = value.tracks.href
        }
    }

    private tracksURL?: PlaylistTracksRefObject['href']
    loadTracks(token: string) {
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
                    return resolve(this.addTrack(...tracks.map(track => new ListItem<TrackObject>(track))))
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
    private loadIndex? = 0
    private addTrack(...items: ListItem<TrackObject>[]): number {
        if (this.loadIndex === undefined) return this.items.push(...items)
        items.forEach((item, i) => {
            this.items[this.loadIndex! + i] = item
        })
        this.loadIndex += items.length
        return this.loadIndex
    }

    findDuplicates() {
        const originalIndexs: (number | undefined)[] = []
        const { items: tracks } = this

        for (let index = 0; index < this.items.length; index++) {
            const track = tracks[index]
            let originalIndex
            for (let i = 0; i < index; i++) {
                // if (track.track.name == 'Riri' && this.items[i].track.name == 'Riri') debugger
                const similarities = track.compare(this.items[i])
                if (similarities) {
                    track.similarities = similarities
                    originalIndex = i
                    break
                }
            }
            originalIndexs.push(originalIndex)
        }

        const offset = this.items.length - 1
        originalIndexs.reverse().forEach((originalIndex, i) => {
            if (originalIndex) {
                const duplicates = this.items.splice(offset - i, 1)

                this.items[originalIndex].duplicates.push(...duplicates)
            }
        })
    }
}
