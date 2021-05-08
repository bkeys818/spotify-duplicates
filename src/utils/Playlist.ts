import { filterImages } from '../components/CoverImage'
import { request } from './spotify'
import fetch from 'node-fetch'

export default class Playlist {
    constructor(value: SimplifiedPlaylistObject) {
        this.id = value.id
        this.name = value.name
        this.coverImage = filterImages(value.images)?.url

        this.tracks = []
        this.trackURL = value.tracks.href
    }

    readonly id: string
    readonly name: string
    readonly coverImage?: string
    readonly tracks: PlaylistTrackObject[]

    private trackURL: string

    async getTracks(token: string) {
        try {
            const response = await fetch(this.trackURL, {
                // mode: 'no-cors',
                headers: {
                    Authorization: token
                }
            })
            if (!response.ok) {
                // TODO - Throw detailed error
                console.error(response.statusText)
                response.json().then(console.error)
                throw new Error('Error fetching Tracks')
            }
            const pagingObj = await response.json() as PagingObject<PlaylistTrackObject>
            this.tracks.push(...pagingObj.items)

            if (pagingObj.next) {
                this.trackURL = pagingObj.next
                // REVIEW - Remove await?
                // If I remove await, will the component still refresh when the reset of the tracks are added?
                await this.getTracks(token)
            }
        } catch(err) {
            if (err instanceof Error) throw err
            else throw new Error(err)
        }
    }
}