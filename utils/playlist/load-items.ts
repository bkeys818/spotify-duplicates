import EditPlaylist from '../../src/pages/edit-playlist'
import Item from './item'
import { request } from 'spotify-api-request'
import type {
    PlaylistObject,
    PlaylistTrackObject,
} from 'spotify-api-request/types/objects'

export default function loadItems(this: EditPlaylist): Promise<void> {

    type Params = [PlaylistObject['tracks']['href'] | null, PlaylistTrackObject[]]
    const addTracksAndGetNextUrl = (...[url, tracks]: Params): Promise<Params> => {
        return Promise.all([
            url
                ? request({
                    url: url,
                    method: 'GET',
                    token: this.state.token
                })
                : null,
            new Promise((resolve: (value: void) => void) => {
                if (tracks.length > 0) {
                    const loadedItems = tracks.map(Item.new)
                    this.setState(
                        ({ items }) => {
                            const updatedValues = items!.slice()
                            updatedValues.splice(
                                items!.findIndex(item => !item),
                                loadedItems.length,
                                ...loadedItems
                            )
                            return {
                                items: updatedValues
                            }
                        },
                        resolve
                    )
                } else resolve()
            }),
        ]).then(([res]) => {
            if (res) return addTracksAndGetNextUrl(res.next, res.items)
            else return [res, []]
        })
    }

    return addTracksAndGetNextUrl(this.state.itemsInfo!.href, []).then(() => {
        this.setState({
            itemsInfo: undefined
        });
    })
}
