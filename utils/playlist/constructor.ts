import Playlist from '.'

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