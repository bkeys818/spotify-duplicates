import React from 'react'
import { Page, ScrollLock } from './wrappers'
import PlaylistPreview from './PlaylistPreview'
import EditPlaylist from './EditPlaylist'

import '../style/App.scss'

import Playlist from '../utils/Playlist'
import { request } from '../utils/spotify'

interface AppProps {
    accessToken: string
}
interface AppStates {
    playlists: Playlist[]
    selected?: Playlist
}

export default class App extends React.Component<AppProps, AppStates> {
    constructor(props: AppProps) {
        super(props)
        this.state = {
            playlists: [],
        }
    }

    componentDidMount() {
        request("Get a List of Current User's Playlists", {
            token: this.props.accessToken ?? '',
        })
            .then(response => {
                this.setState({
                    playlists: response.items.map(
                        playlist => new Playlist(playlist)
                    ),
                })
            })
            .catch(console.error)
    }

    selectPlaylist(playlist: Playlist) {
        playlist.getTracks(this.props.accessToken)
            .then(() => this.setState({ selected: playlist }))
    }

    render() {
        const { playlists, selected } = this.state
        return (
            <div id="app-container">
                <Page>
                    <ScrollLock>
                        <div className="playlist-container">
                            {playlists.map(playlist => (
                                <PlaylistPreview
                                    key={playlist.id}
                                    name={playlist.name}
                                    cover={playlist.coverImage}
                                    handleClick={() => {
                                        this.selectPlaylist(playlist)
                                    }}
                                />
                            ))}
                        </div>
                    </ScrollLock>
                </Page>
                <Page layer={1} in={selected ? true : false} >
                    <EditPlaylist playlist={selected} ></EditPlaylist>
                </Page>
            </div>
        )
    }
}