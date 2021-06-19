import PlaylistView from '../../src/pages/playlist-view'
import Item from './item'

export default function findDuplicates(this: PlaylistView) {
    const originalIndexs: (number | undefined)[] = []
    const { items } = this.state

    for (let index = 0; index < items!.length; index++) {
        const item = items![index]
        let originalIndex
        for (let i = 0; i < index; i++) {
            // if (track.track.name == 'Riri' && this.items[i].track.name == 'Riri') debugger
            const similarities = compareTracks(item.track, items![i].track)
            if (similarities) {
                item.similarities = similarities
                originalIndex = i
                break
            }
        }
        originalIndexs.push(originalIndex)
    }

    const updatedValues = items!.slice(),
        offset = items!.length - 1
    originalIndexs.reverse().forEach((originalIndex, i) => {
        if (originalIndex) {
            const duplicates = updatedValues.splice(offset - i, 1)
            updatedValues[originalIndex].duplicates.push(...duplicates)
        }
    })
    this.setState({ items: updatedValues })
}

export type Similarities = ['identical'] | /*['track'] |*/ ['track', 'artists'] | ['track', 'artists', 'album']

export function compareTracks(a: Item['track'], b: Item['track']): Similarities | void {
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

    // } else if (a.type === 'episode' && b.type === 'episode') {
    //     // TODO - Compare function for Episodes
    } else {}
}


function stripParenthesis(value: string) {
    const match = value.match(/^(?<name>.+?)(?: \(.+\))?$/)
    if (!match?.groups?.name)
        throw new Error("Error! Couldn't strip parenthesis from string")
    return match.groups.name
}