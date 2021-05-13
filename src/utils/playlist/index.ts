import { CustomTrackObj } from './track-object'
import { convertResponse } from './convert-response'
import { getTracks } from './track-object'
import { findDuplicates } from './read-data'

interface Playlist {
    readonly id: string
    readonly name: string
    readonly coverImage?: string
    readonly tracksURL: string
    tracks: CustomTrackObj[]
}

const Playlist = {
    convertResponse: convertResponse,
    getTracks: getTracks,
    findDuplicates: findDuplicates
}
export default Playlist
