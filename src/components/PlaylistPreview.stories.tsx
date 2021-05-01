import React from 'react'

import PlaylistPreview from './PlaylistPreview'
import * as Spotify from '../spotify'
import { modifyPlaylistObject } from './App'

export default {
    component: PlaylistPreview,
    title: 'Playlist Preview',
}

type Loaders = { loaded: { playlist: ReturnType<typeof modifyPlaylistObject> } }
const loaders = [
    async () => ({
        playlist: modifyPlaylistObject(await Spotify.request('Get a Playlist', {
            token: 'Bearer ' + (await Spotify.authorize({
                clientID: process.env.STORYBOOK_CLIENT_ID!,
                clientSecret: process.env.STORYBOOK_CLIENT_SECRET!
            })).access_token,
            pathParameter: {
                '{playlist_id}': '2oGXW218O4QdwjtKEEGKGP'
            }
        }))
    }),
];

export const Default = (args: any, { loaded: { playlist } }: Loaders) => (
    <PlaylistPreview name={playlist.name} cover={playlist.cover} />
)
Default.loaders = loaders

export const NoCover = (args: any, { loaded: { playlist } }: Loaders) => (
    <PlaylistPreview name={playlist.name} />
)
NoCover.loaders = loaders
