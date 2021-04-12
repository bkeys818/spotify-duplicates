import React from "react"

import "./Playlist.scss"

// @ts-ignore
import spotifyLogo from "../assets/spotify-logos/Spotify_Icon_RGB_White.png"


export interface PlaylistProps {
    url: string
}
interface PlaylistState {
    title?: string
    cover?: string | null
    tracksURL?: string
}
export default class Playlist extends React.Component<PlaylistProps, PlaylistState> {
    constructor(props: PlaylistProps) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className={"playlist" + (this.state.cover === undefined ? " loading" : "")}>
                <div className={"cover" + (this.state.cover === null ? " empty" : "")}>
                    <img src={this.state.cover ?? spotifyLogo} alt="Album Cover" />
                </div>
                <p {...(this.state.cover === undefined ? { style: { paddingRight: `${random(50, 80)}%` } } : {} )}>{this.state.title}</p>
            </div>
        );
    }
}

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;