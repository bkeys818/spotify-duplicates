import React, { Component } from "react"

import { request } from "../spotify"

import PlaylistPreview from "./PlaylistPreview"

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
        this.closeModal = this.closeModal.bind(this)
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

    selectPlaylist(value: SimplifiedPlaylistObject) {
        this.setState({ selected: value })
    }
    closeModal() {
        this.setState({ selected: null })
    }

    render() {
        const { selected, playlists } = this.state
        return (
            <div className={"app-wrapper" + (selected ? " showing-modal" : "")}>
                <div className="playlist-container">
                    {playlists.map(playlist => (
                            <PlaylistPreview
                            key={playlist.id}
                            name={playlist.name}
                            images={playlist.images}
                            tracks={playlist.tracks}
                            handleClick={() => {
                                this.selectPlaylist(playlist)
                            }}
                        />
                    ))}
                </div>
                <Modal handleClose={this.closeModal} />
            </div>
        )
    }
}
