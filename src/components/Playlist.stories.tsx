import React from 'react';
import { Story,  } from "@storybook/react";

import Playlist from "./Playlist"
import type { PlaylistProps } from "./Playlist"
import Spotify from "../spotify"

export default {
    component: Playlist,
    title: "Playlist"
}

interface DefaultLoaders { loaded: { playlist: PlaylistProps } }
export const Default = (args: any, { loaded: { playlist } }: DefaultLoaders) => <Playlist {...playlist} />;
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

interface NoCoverLoaders { loaded: { playlist: Omit<PlaylistProps, "images"> } }
export const NoCover = (args: any, { loaded: { playlist } }: NoCoverLoaders) => <Playlist {...playlist} images={[]} />;
NoCover.loaders = Default.loaders