import PlaylistView from '../../src/pages/playlist-view'
import { navigate } from 'gatsby'

import Item from './item'
import { request } from 'spotify-api-request'
import type {
    PlaylistObject,
    PlaylistTrackObject,
    PagingObject
} from 'spotify-api-request/types/objects'

export default async function loadItems(this: PlaylistView): Promise<void> {
    const sendRequest = async (url: PlaylistTracksUrl) => {
        try {
            const response = await request({
                url: url,
                method: 'GET',
                token: this.state.token
            }) as PagingObject<PlaylistTrackObject>
            if (response.next) sendRequest(response.next)
            this.setState(state => ({
                items: [
                    ...state.items,
                    ...response.items.map(Item.new)
                ]
            }))
        } catch(error) {
            console.log(error.message)
            if (
                error.name == 'SpotifyError' &&
                error.type == 'authorization' && 
                (error.message as string)
                    .endsWith('The access token expired')
            ) navigate('/login/')
        }
    }
    if (!this.state.itemsInfo) throw new Error('itemInfo not yet loaded')
    sendRequest(this.state.itemsInfo!.href)
}

type SendRequestReturn = Pick<PlaylistObject['tracks'], 'next' | 'items'>
type PlaylistTracksUrl = Exclude<SendRequestReturn['next'], null>

// export default function loadItems(this: EditPlaylist): Promise<void> {

//     type Params = [PlaylistObject['tracks']['href'] | null, PlaylistTrackObject[]]
//     const addTracksAndGetNextUrl = (...[url, tracks]: Params): Promise<Params> => {
//         return Promise.all([
//             url
//                 ? request({
//                     url: url,
//                     method: 'GET',
//                     token: this.state.token
//                 })
//                 : null,
//             new Promise((resolve: (value: void) => void) => {
//                 if (tracks.length > 0) {
//                     const loadedItems = tracks.map(Item.new)
//                     this.setState(
//                         ({ items }) => {
//                             const updatedValues = items!.slice()
//                             updatedValues.splice(
//                                 items!.findIndex(item => !item),
//                                 loadedItems.length,
//                                 ...loadedItems
//                             )
//                             return {
//                                 items: updatedValues
//                             }
//                         },
//                         resolve
//                     )
//                 } else resolve()
//             }),
//         ]).then(([res]) => {
//             if (res) return addTracksAndGetNextUrl(res.next, res.items)
//             else return [res, []]
//         })
//     }

//     return addTracksAndGetNextUrl(this.state.itemsInfo!.href, []).then(() => {
//         this.setState({
//             itemsInfo: undefined
//         });
//     })
// }
