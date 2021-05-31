import EditPlaylist from '../../src/pages/edit-playlist'
import Item from './item'

import { requestWithURL } from '../spotify'

export default function loadItems(this: EditPlaylist): Promise<void> {

    type Params = [PlaylistObject['tracks']['href'] | null, PlaylistTrackObject[]]
    const addTracksAndGetNextUrl = (...[url, tracks]: Params): Promise<Params> => {
        return Promise.all([
            url
                ? requestWithURL({
                      url: url,
                      method: 'GET',
                      token: this.state.token,
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
