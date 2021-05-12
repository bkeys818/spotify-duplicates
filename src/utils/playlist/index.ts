import { convertResponse } from './convert-response'
import { getTracks } from './get-data'

export interface PlaylistInfo {
    readonly id: string
    readonly name: string
    readonly coverImage?: string
    tracks: PlaylistTrackObject[],
    readonly tracksURL: string
}

export default class Playlist {
    constructor(value: PlaylistInfo) {
        this.id  = value.id
        this.tracksURL = value.tracksURL
        this.name  = value.name
        this.coverImage  = value.coverImage
        this.tracks  = value.tracks
    }

    private readonly id: string
    private readonly tracksURL: string

    readonly name: string
    readonly coverImage?: string
    tracks: PlaylistTrackObject[]

    static convertResponse = convertResponse

    getTracks(token: string) { return getTracks(this.tracksURL, token) }
}