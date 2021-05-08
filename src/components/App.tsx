import React, { Component } from 'react'

import { request } from '../spotify'
import { filterImages } from './CoverImage'

import Modal from './Modal'
import PlaylistPreview from './PlaylistPreview'

import '../style/App.scss'

type ModifiedPlaylistObject = ReturnType<typeof modifyPlaylistObject>
interface AppProps {
    accessToken: string
}
interface AppStates {
    playlists: ModifiedPlaylistObject[]
    selected?: ModifiedPlaylistObject | null
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
            token: this.props.accessToken ?? '',
        })
            .then(response => {
                this.setState({
                    playlists: (response?.items ?? this.state.playlists).map(
                        modifyPlaylistObject
                    ),
                })
            })
            .catch(console.error)
    }

    selectPlaylist(value: ModifiedPlaylistObject) {
        this.setState({ selected: value })
    }
    closeModal() {
        this.setState({ selected: null })
    }

    render() {
        const { selected, playlists } = this.state
        return (
            <div className="app-wrapper">
                <Modal
                    handleClose={this.closeModal}
                    active={selected ? true : false}
                />
                <div className="scroll-wrapper">
                    <div className="playlist-container">
                        {playlists.map(playlist => (
                            <PlaylistPreview
                                key={playlist.id}
                                name={playlist.name}
                                cover={playlist.cover}
                                handleClick={() => {
                                    this.selectPlaylist(playlist)
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export function modifyPlaylistObject(original: SimplifiedPlaylistObject) {
    const { images, ...otherProps } = original
    return {
        ...otherProps,
        selected: false,
        cover: filterImages(images)?.url,
    }
}
