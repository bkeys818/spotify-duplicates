import React from 'react'

import PlaylistPreview from '../components/PlaylistPreview'
import { testToken, request } from '../../utils/spotify'
import { StaticPlaylist } from '../../utils/playlist'

export default {
    component: PlaylistPreview,
    title: 'Playlist Preview',
}

type Loaders = { loaded: { playlist: StaticPlaylist } }
const loaders = [
    async () => ({
        playlist: StaticPlaylist.new(
            await request('Get a Playlist', {
                token: await testToken,
                pathParameter: {
                    '{playlist_id}': '2oGXW218O4QdwjtKEEGKGP'
                }
            })
        )
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
