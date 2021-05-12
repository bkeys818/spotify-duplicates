import { PlaylistInfo } from './index'

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

export function convertResponse(from: PlaylistObject): PlaylistInfo {
    return {
        id: from.id,
        name: from.name,
        coverImage: filterImages(from.images)?.url,
        tracks: [],
        tracksURL: from.tracks.href,
    }
}
