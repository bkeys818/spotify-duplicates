import React from 'react'
import { navigate } from 'gatsby'
import Cookies from 'universal-cookie'
import Playlist, { getTracks, convertPlaylist } from '../utils/Playlist'
import { request } from '../utils/spotify'

import PageTemplate from '../template/Page'
import CoverImage from '../components/CoverImage'
import Track from '../components/Track'
import Button from '../components/Button'

import '../style/EditPlaylist.scss'

interface EditPlaylistProps {
    location: Location & {
        state: {
            token: string
            playlist: Playlist
        }
    }
}
export type EditPlaylistLinkProps = EditPlaylistProps['location']['state']
interface EditPlaylistStates {
    playlist?: Playlist
}

export default class EditPlaylist extends React.Component<
    EditPlaylistProps | { location: Location },
    EditPlaylistStates
> {
    private token: string

    constructor(props: EditPlaylistProps | { location: Location }) {
        super(props)
        this.token = 'state' in props.location
            ? new Cookies().get<string | undefined>('access_token') ?? ''
            : ''
        this.state = {}
    }

    componentDidMount() {
        const { location } = this.props
        let promise: Promise<string>

        if ('state' in location) {
            this.token = location.state.token
            this.setState({
                playlist: location.state.playlist,
            })
            promise = new Promise(resolve => {
                resolve(location.state.playlist.tracksURL)
            })
        } else {
            if (this.token == '') navigate('/login/')
            const id = (() => {
                const match = location.href.match(/id=(?<id>[a-z]\d]+)/i)
                if (!(match && match.groups && 'id' in match.groups)) {
                    navigate('/')
                    return ''
                } else return match.groups.id
            })()
            promise = request('Get a Playlist', {
                token: this.token,
                pathParameter: {
                    "{playlist_id}": id
                }
            }).then(playlist => {
                const converted = convertPlaylist(playlist)
                this.setState({ playlist: converted })
                return playlist.tracks.href
            })
        }

        promise.then(url => getTracks(url, this.token)).then(respTracks => {
            const playlist = this.state.playlist!
            playlist.tracks = respTracks
            this.setState({
                playlist: playlist
            })
        })
    }

    render() {
        const { playlist } = this.state

        const Buttons = () => (
            <div className="align-container">
                <div id="playlist-actions">
                    <Button>Button 1</Button>
                    <Button>Button 2</Button>
                    <Button>Button 3</Button>
                </div> 
            </div>
        )

        const PlaylistHeader = () => (
            <div id="playlist-header">
                <CoverImage src={playlist?.coverImage} />
                <h3 className={'clip-text ' + (playlist ? undefined : 'loading-text')}>{playlist?.name ?? ''}</h3>
            </div>
        )

        const TrackList = () => (
            <div id="tracks-container">
                <Track title="Title" artist="Artist" album="Album" />
                {playlist?.tracks.map(playlistItem => {
                    // TODO - Build view for episode playlist
                    if ('album' in playlistItem.track) {
                        return (
                            <Track
                                id={playlistItem.track.id}
                                title={playlistItem.track.name}
                                artist={playlistItem.track.artists
                                    .map(artist => artist.name)
                                    .join(', ')}
                                album={playlistItem.track.album.name}
                            />
                        )
                    }
                })}
            </div>
        )

        return (
            <PageTemplate>
                <Buttons/>
                <PlaylistHeader/>
                <TrackList/>
            </PageTemplate>
        )
    }
}
