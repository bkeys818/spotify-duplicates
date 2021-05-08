export default interface Playlist {
    readonly id: string
    readonly name: string
    readonly coverImage?: string
    tracks: PlaylistTrackObject[],
    readonly tracksURL: string
}

export function convertPlaylist(from: PlaylistObject): Playlist {
    return {
        id: from.id,
        name: from.name,
        coverImage: filterImages(from.images)?.url,
        tracks: [],
        tracksURL: from.tracks.href,
    }
}

export async function getTracks(url: string, token: string) {
    const tracks: PlaylistTrackObject[] = []
    try {
        const response = await fetch(url , {
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
        tracks.push(...pagingObj.items)

        if (pagingObj.next) {
            // REVIEW - Remove await?
            // If I remove await, will the component still refresh when the reset of the tracks are added?
            await getTracks(pagingObj.next, token)
        }

        return tracks
    } catch(err) {
        if (err instanceof Error) throw err
        else throw new Error(err)
    }
}

export const imageMin = 84

export function filterImages(values: ImageObject[]): ImageObject | null {
    if (values.length == 1 && !(values[0].height || values[0].width))
        return values[0]
    const imgs = values
        .map(img => {
            return {
                url: img.url,
                size:
                    img.height && img.width
                        ? img.height < img.width
                            ? img.height
                            : img.width
                        : undefined,
            }
        })
        .filter(img => {
            return img.size ? img.size >= imageMin : img
        })
    const smallest = imgs.find((img, i, array) =>
        img.size
            ? Math.max.apply(
                  null,
                  array.map(img => img.size!)
              )
            : false
    )
    if (smallest) return smallest
    else if (imgs.length > 0) return imgs[0]
    else return null
}