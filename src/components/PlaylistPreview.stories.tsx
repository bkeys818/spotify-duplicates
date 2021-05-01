import React from 'react';
import { Story,  } from "@storybook/react";

import PlaylistPreview from "./PlaylistPreview"
import type { PlaylistPreviewProps } from "./PlaylistPreview"
import * as Spotify from "../spotify"

export default {
    component: PlaylistPreview,
    title: "Playlist"
}

interface DefaultLoaders { loaded: { playlist: PlaylistPreviewProps } }
export const Default = (args: any, { loaded: { playlist } }: DefaultLoaders) => <PlaylistPreview {...playlist} />;
Default.loaders = [
    async () => ({
        playlist: await Spotify.request("Get a Playlist", {
            token: "Bearer " + (await Spotify.authorize({
                clientID: process.env.STORYBOOK_CLIENT_ID!,
                clientSecret: process.env.STORYBOOK_CLIENT_SECRET!
            })).access_token,
            pathParameter: {
                "{playlist_id}": "2oGXW218O4QdwjtKEEGKGP"
            }
        })
    }),
]

interface NoCoverLoaders { loaded: { playlist: Omit<PlaylistPreviewProps, "images"> } }
export const NoCover = (args: any, { loaded: { playlist } }: NoCoverLoaders) => <PlaylistPreview {...playlist} images={[]} />;
NoCover.loaders = Default.loaders