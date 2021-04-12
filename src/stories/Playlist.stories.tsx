import React from "react";
import { Story } from "@storybook/react";

import Playlist from "./Playlist"
import type { PlaylistProps } from "./Playlist"

export default {
    component: Playlist,
    title: "Playlist"
}

const Template: Story<PlaylistProps> = (args: PlaylistProps) => <Playlist {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: "Listening To",
    cover: "https://mosaic.scdn.co/300/ab67616d0000b2733504664c17b7b99a3cb7d116ab67616d0000b2737fcead687e99583072cc217bab67616d0000b273ceea5b1c5fe2d39076d976e3ab67616d0000b273edc7f6ff6a0c2935a5177c83"
}

export const Loading = Template.bind({});
Loading.args = {}

export const NoCover = Template.bind({});
NoCover.args = {
    title: "Listening To",
    cover: null
}

export const Searching = Template.bind({});
Searching.args = {
    ...Default.args,
    isSearching: true
}

export const HasDuplicates = Template.bind({});
HasDuplicates.args = {
    ...Default.args,
    isSearching: false,
    duplicateCount: 12
}

export const NoDuplicates = Template.bind({});
NoDuplicates.args = {
    ...HasDuplicates.args,
    duplicateCount: 0
}