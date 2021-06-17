import React from 'react'
import { Meta } from './custom-storybook-types'

import PlaylistPreview, { PlaylistPreviewProps } from '../components/PlaylistPreview'
import { testToken, request } from '../../utils/spotify'
import { StaticPlaylist } from '../../utils/playlist'

export default {
    component: PlaylistPreview,
    title: 'Playlist Preview',
} as Meta<PlaylistPreviewProps>

type Loaders = { loaded: { staticPlaylist: StaticPlaylist } }

export const Default = (args: any, { loaded: { staticPlaylist } }: Loaders) => (
    <PlaylistPreview name={staticPlaylist.name} cover={staticPlaylist.coverImage} />
)

export const NoCover = (args: any, { loaded: { staticPlaylist } }: Loaders) => (
    <PlaylistPreview name={staticPlaylist.name} />
)
