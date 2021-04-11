import React from "react"
import { Story } from "@storybook/react";

import DuplicateTracks, { DuplicateTracksProps } from "./DuplicateTracks"

export default {
    component: DuplicateTracks,
    title: "DuplicateTracks"
}

const original: DuplicateTracksProps["original"] = {
    name: "Livin' On A Prayer",
    artist: "Bon Jovi",
    album: "Bon Jovi Greatest Hits",
    id: "501a0590-a53f-4ff8-b963-8a62f3f11d08"
}

const duplicates: DuplicateTracksProps["duplicates"] = [
    {
        name: "Animals",
        artist: "V",
        album: "Maroon",
        id: "d93dece8-5441-407c-99ea-e05c8e56e59f"
    },
    {
        name: "That's What I Like",
        artist: "24K Magic",
        album: "Bruno Mars",
        id: "98ba1fdc-b418-4035-80b5-7b6d75ec9249"
    },
    {
        name: "Scared To Be Lonely",
        artist: "Scared To Be Lonely (Remixes, Vol. 1)",
        album: "Martin Garrix & Dua Lipa",
        id: "ad0abcf7-f469-4460-9860-f13f84dfbe06"
    },
    {
        name: "Stronger (What Doesnt Kill You)",
        artist: "Stronger",
        album: "Kelly Clarkson",
        id: "af25463b-931c-45d1-944e-2e37644188f1"
    },
]

const Template: Story<DuplicateTracksProps> = (args: DuplicateTracksProps) => <DuplicateTracks {...args} />;

export const Default =  Template.bind({})
Default.args = {
    original: original,
    duplicates: duplicates
}

export const NoDuplicate =  Template.bind({})
NoDuplicate.args = {
    original: original,
    duplicates: []
}