import React from 'react'

import PlaylistPreview from '../components/PlaylistPreview'
import * as Spotify from '../utils/spotify'
import Playlist from '../utils/playlist'

export default {
    component: PlaylistPreview,
    title: 'Playlist Preview',
}

type Loaders = { loaded: { playlist: Playlist } }
const loaders = [
    async () => ({
        playlist: Playlist.convertResponse(await Spotify.request('Get a Playlist', {
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
    <PlaylistPreview name={playlist.name} cover={playlist.coverImage} />
)
Default.loaders = loaders

export const NoCover = (args: any, { loaded: { playlist } }: Loaders) => (
    <PlaylistPreview name={playlist.name} />
)
NoCover.loaders = loaders
