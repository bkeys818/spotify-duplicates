export interface CustomTrackObj extends PlaylistTrackObject {
    duplicates: PlaylistTrackObject[]
}

type ObjectWithTrackWithID = {
    track: {
        id: string
    }
}

export class Unique<T extends ObjectWithTrackWithID> {
    [n: number]: T & {
        duplicates: T[]
    }
    length = 0
    constructor(...items: Unique<T>[number][]) {
        this.push(...items)
    }

    push(...items: Unique<T>[number][]) {
        items.forEach(item => {
            for(let i = 1; i < this.length; i++) {
                if (item.track.id === this[i].track.id) {
                    this[i].duplicates.push(item)
                    return
                }
            }
            this[this.length] = item
            this.length++
        })
    }
}

export async function getTracks(url: string, token: string) {
    const tracks = new Unique(...([] as CustomTrackObj[]))

    const res = await fetch(url, {
        headers: {
            Authorization: token,
        },
    })

    if (!res.ok) {
        // TODO - Throw detailed error
        console.error(res.statusText)
        res.json().then(console.error)
        throw new Error('Error fetching Tracks')
    }

    const pagingObj: PagingObject<PlaylistTrackObject> = await res.json()

    tracks.push(...convertTracks(pagingObj.items))
    if (pagingObj.next)
        tracks.push(...convertTracks(await getTracks(pagingObj.next, token)))

    return Array.from(tracks)
}

function convertTracks(items: PlaylistTrackObject[]): CustomTrackObj[] {
    return items.map(track => ({
        duplicates: [],
        ...track,
    }))
}
