import React from 'react'
import { navigate } from 'gatsby'
import Cookies from 'universal-cookie'
import  Playlist from '../utils/playlist'
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
export interface EditPlaylistStates {
    playlist?: Playlist
}

export default class EditPlaylist extends React.Component<
    EditPlaylistProps | { location: Location },
    EditPlaylistStates
> {
    private token: string

    constructor(props: EditPlaylistProps | { location: Location }) {
        super(props)
        this.token =
            'state' in props.location
                ? new Cookies().get<string | undefined>('access_token') ?? ''
                : ''
        this.state = {}
    }

    componentDidMount() {
        const { location } = this.props
        let promise: Promise<Playlist>

        if ('state' in location) {
            this.token = location.state.token
            promise = new Promise(resolve => {
                resolve(location.state.playlist)
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
                    '{playlist_id}': id,
                },
            }).then(playlist => Playlist.convertResponse(playlist))
        }

        promise.then(playlist => {
            this.setState({
                playlist: playlist
            })
            Playlist.getTracks(playlist.tracksURL, this.token).then(tracks => {

                this.setState({
                    playlist: {
                        ...playlist,
                        tracks: tracks,
                    },
                })
            })
        })
    }

    render() {
        const { playlist } = this.state

        const Buttons = () => (
            <div className="align-container">
                <div id="playlist-actions">
                    <Button onClick={() => { 
                        // @ts-ignore
                        Playlist.findDuplicates(this.state.playlist!.tracks)
                    }} >Button 1</Button>
                </div>
            </div>
        )

        const PlaylistHeader = () => (
            <div id="playlist-header">
                <CoverImage src={playlist?.coverImage} />
                <h3
                    className={
                        'clip-text ' + (playlist ? undefined : 'loading-text')
                    }
                >
                    {playlist?.name ?? ''}
                </h3>
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
                                key={playlistItem.track.id}
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
                <Buttons />
                <PlaylistHeader />
                <TrackList />
            </PageTemplate>
        )
    }
}