import Playlist, { StaticPlaylist } from '.'
import Item from './item'

export function staticConstructor(value: SimplifiedPlaylistObject | PlaylistObject): StaticPlaylist {
    return (({ name, id, tracks, images }) => ({
        name,
        id,
        itemsInfo: (({ href, total}) => ({ href, total}))(tracks),
        coverImage: filterImages(images)
    } as StaticPlaylist))(value)
}

function constructor(value: StaticPlaylist): Playlist
function constructor(value: PlaylistObject): Playlist
function constructor(value: StaticPlaylist | PlaylistObject): Playlist {
    const staticPlaylist = 
        'tracks' in value
            ? staticConstructor(value)
            : value

    const results: Playlist = {
        ...staticPlaylist,
        items: new Array(staticPlaylist.itemsInfo!.total)
    }

    if ('tracks' in value) {
        results.items = value.tracks.items.map(Item.new)
        if (value.tracks.next) {
            results.itemsInfo!.href = value.tracks.next
        } else {
            delete results.itemsInfo
        }
    }
    return results
}
export default constructor

/** Smallest an image can be (comes form scss) */
export const imageMin = 84

export function filterImages(values: ImageObject[]): string | null {
    if (values.length == 1 && !(values[0].height || values[0].width))
        return values[0].url
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
            return img.size ? img.size >= imageMin : img.url
        })
    const smallest = imgs.find((img, i, array) =>
        img.size
            ? Math.max.apply(
                  null,
                  array.map(img => img.size!)
              )
            : false
    )
    if (smallest) return smallest.url
    else if (imgs.length > 0) return imgs[0].url
    else return null
}