import React, { Component } from "react"

import { request } from "../spotify"

import Playlist from "./Playlist"

import "./App.scss"

interface AppProps {
    accessToken: string
}
interface AppStates {
    playlists: SimplifiedPlaylistObject[]
    selected?: SimplifiedPlaylistObject | null
}

export default class App extends Component<AppProps, AppStates> {
    constructor(props: AppProps) {
        super(props)
        this.state = {
            playlists: [],
        }
    }

    componentDidMount() {
        request("Get a List of Current User's Playlists", {
            token: this.props.accessToken ?? "",
        })
            .then(res => {
                this.setState({ playlists: res?.items ?? this.state.playlists })
            })
            .catch(console.error)
    }

    render() {
        const { playlists } = this.state
        return (
            <div className="app-wrapper">
                <div className="playlist-container">
                    {playlists.map(playlist => (
                        <Playlist
                            key={playlist.id}
                            name={playlist.name}
                            images={playlist.images}
                            tracks={playlist.tracks}
                        />
                    ))}
                </div>
            </div>
        )
    }
}
