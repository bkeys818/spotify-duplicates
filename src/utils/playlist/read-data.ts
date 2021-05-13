import { CustomTrackObj } from './track-object'

interface CompariableTrack extends Pick<PlaylistTrackObject['track'], 'name'> {
    album: Pick<TrackObject['album'], 'name'>
    artists: Pick<TrackObject['artists'][number], 'id'>[]
}

export function compareTracks(a: CompariableTrack, b: CompariableTrack): number {
    const stripParenthesis = (value: string) => {
        const match = value.match(/^(?<name>.+?)(?: \(.+\))?$/)
        if (!match?.groups?.name)
            throw new Error("Error! Couldn't strip parenthesis from string")
        return match.groups.name
    }

    // similar track names
    if (stripParenthesis(a.name) !== stripParenthesis(b.name)) return 0

    // similar albums
    if (stripParenthesis(a.album.name) !== stripParenthesis(b.album.name))
        return 1

    // similar artist
    const bArtistsIds = b.artists.map(artist => artist.id)
    for (const artist of a.artists) {
        if (bArtistsIds.includes(artist.id)) return 3
    }

    return 2
}

interface CompariablePlaylistTrack {
    track: CompariableTrack & Pick<PlaylistTrackObject['track'], 'type'>
    duplicates: CompariablePlaylistTrack[]
}


export function findDuplicates(tracks: CompariablePlaylistTrack[]) {
    const returnValue: CompariablePlaylistTrack[] = []
    while (tracks.length > 1) {
        if (tracks[0].track.type === 'track')
            for(let i = 1; i < tracks.length; i++) {
                if (tracks[i].track.type === 'episode') continue

                const equality = compareTracks(
                    tracks[0].track,
                    tracks[i].track
                )
                if (equality) {
                    const duplicate = tracks.splice(i, 1)[0]
                    tracks[0].duplicates.push(duplicate)
                }
            }
        returnValue.push(tracks.shift()!)
    }
    returnValue.push(tracks.shift()!)
    return returnValue
}