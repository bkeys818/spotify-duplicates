import React from 'react'
import { Link } from 'gatsby'

import Header from './Header'
import Footer from './Footer'
import { Page, ScrollLock } from '../wrappers'
import PlaylistPreview from '../PlaylistPreview'
import EditPlaylist from '../EditPlaylist'

import '../../style/App.scss'

import Playlist from '../../utils/Playlist'
import { request } from '../../utils/spotify'

import type { EditPlaylistProps } from '../../pages/edit-playlist'

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
        playlist
            .getTracks(this.props.accessToken)
            .then(() => this.setState({ selected: playlist }))
    }

    render() {
        const { playlists, selected } = this.state
        return (
            <div id="app-container">
                <Header />
                <main>
                    <div className="playlist-container">
                        {playlists.map(playlist => (
                            <Link
                                to="/edit-playlist"
                                state={linkProps({
                                    playlist: playlist,
                                    token: this.props.accessToken,
                                })}
                            >
                                <PlaylistPreview
                                    key={playlist.id}
                                    name={playlist.name}
                                    cover={playlist.coverImage}
                                />
                            </Link>
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        )
    }
}

function linkProps(props: EditPlaylistProps) {
    return props
}
