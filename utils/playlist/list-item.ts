import type { IndicatorSvgState } from '../../src/assets/state-svg'

export type Item = Pick<TrackObject, 'name' | 'id'> & {
    artists: Pick<TrackObject['artists'][number], 'id'>[]
    album: Pick<TrackObject['album'], 'name'>
    type: TrackObject['type'] | EpisodeObject['type']
}
type ListItemWrapper<T extends Item> = {
    track: T
    duplicates: ListItem<T>[]
    state?: IndicatorSvgState
    similarities?: Exclude<Similarities, 0>
    [key: string]: any
}

export type Similarities = ['identical'] | /*['track'] |*/ ['track', 'artists'] | ['track', 'artists', 'album']

export default class ListItem<I extends Item> implements ListItemWrapper<I> {
    track: ListItemWrapper<I>['track']
    duplicates: ListItemWrapper<I>['duplicates'] = []
    state?: ListItemWrapper<I>['state']
    similarities?: Similarities
    [key: string]: any

    constructor(value: Omit<ListItemWrapper<I>, 'duplicates'>)
    constructor(testingValue: I) 
    constructor(value: I | Omit<ListItemWrapper<I>, 'duplicates'>) {
        if ('track' in value) {
            this.track = value.track
            for(const key in value) {
                this[key] = value[key]
            }
        } else {
            this.track = value as I
        }
    }

    compare(to: ListItem<I>): Similarities | void {
        const a = this.track, b = to.track

        if (a.id === b.id) return ['identical']

        if (a.type === 'track' && b.type === 'track') {
            let similarities: Similarities | undefined

            if (a.name === b.name) {
                // same track name
                // similarities = ['track']

                for (const artist of a.artists) {
                    // contains one of the same artist
                    if (b.artists.map(artist => artist.id).includes(artist.id)) {
                        similarities = ['track', 'artists']

                        // similar album names
                        if (
                            // similar album names
                            stripParenthesis(a.album.name) === stripParenthesis(b.album.name) ||
                            // album is name of track (aka. it's a single)
                            a.name === a.album.name ||
                            b.name === b.album.name
                        ) similarities = ['track', 'artists', 'album']

                        break
                    }
                }                
            }

            if (similarities) return similarities

        } else if (a.type === 'episode' && b.type === 'episode') {
            // TODO - Compare function for Episodes
        } else {}
    }

    removeDuplicates() {
        return this.duplicates.splice(0, this.duplicates.length)
    }
}

function stripParenthesis(value: string) {
    const match = value.match(/^(?<name>.+?)(?: \(.+\))?$/)
    if (!match?.groups?.name)
        throw new Error("Error! Couldn't strip parenthesis from string")
    return match.groups.name
}