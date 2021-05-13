import React from 'react'
import { Link, navigate } from 'gatsby'
import Cookies from 'universal-cookie'
import { request } from '../utils/spotify'
import Playlist from '../utils/playlist'

import type { EditPlaylistLinkProps as EditPlaylistProps } from './edit-playlist'

import PageTemplate from '../template/Page'
import PlaylistPreview from '../components/PlaylistPreview'

import '../style/MainPage.scss'

interface IndexProps {
    location: Location
}
interface IndexStates {
    playlists: Playlist[]
    selected?: Playlist
}
export default class Index extends React.Component<IndexProps, IndexStates> {
    private readonly token: string

    constructor(props: IndexProps) {
        super(props)
        this.token = authenticate(props.location.hash) ?? ''
        this.state = {
            playlists: [],
        }
    }

    componentDidMount() {
        if (this.token == '') navigate('/login/')

        console.log(window.location.hash)
        navigate('/', {
            replace: true
        })

        request("Get a List of Current User's Playlists", {
            token: this.token,
        })
            .then(response => {
                this.setState({
                    playlists: response.items.map(Playlist.convertResponse),
                })
            })
            .catch(console.error)
    }

    render() {
        return (
            <PageTemplate>
                <div className="playlist-container">
                    {this.state.playlists.map(playlist => (
                        <Link
                            to={`/edit-playlist?id=${playlist.id}`}
                            state={linkProps({
                                playlist: playlist,
                                token: this.token,
                            })}
                            key={playlist.id}
                        >
                            <PlaylistPreview
                                key={playlist.id}
                                name={playlist.name}
                                cover={playlist.coverImage}
                            />
                        </Link>
                    ))}
                </div>
            </PageTemplate>
        )
    }
}

function linkProps(props: EditPlaylistProps) {
    return props
}

function authenticate(hashStr: Location['hash']) {
    const cookies = new Cookies()

    let accessToken = cookies.get<string | undefined>('access_token')

    if (!accessToken) {
        let isMissingValues = false

        const spotifyAuthState = cookies.get<string | undefined>(
            'spotify_auth_state'
        )

        const hash = Object.fromEntries(
            new Map(
                hashStr
                    .slice(1)
                    .split('&')
                    .map(value => {
                        return value.split('=')
                    }) as [string, string][]
            )
        )

        if (!(spotifyAuthState && 'state' in hash)) {
            isMissingValues = true
            // const missingValue = []
            // if (!spotifyAuthState)
            //     missingValue.push('"spotify_auth_state" cookie')
            // if (!("state" in hash)) missingValue.push('"state" key in hash')

            // console.error(
            //     "Missing authentication values: " +
            //         missingValue.join(" and ")
            // )
        } else if (spotifyAuthState !== hash['state']) {
            isMissingValues = true
            // console.error(
            //     "Autherize values unequal.",
            //     `spotify_auth_state = ${spotifyAuthState}`,
            //     `hash = ${hash["state"]}`
            // )
        }
        if (!('access_token' in hash && 'token_type' in hash)) {
            isMissingValues = true
            const missingValue = []
            // if (!("access_token" in hash))
            //     missingValue.push('"access_token"')
            // if (!("token_type" in hash)) missingValue.push('"token_type"')

            // console.error(
            //     "Hash is missing token related keys: " +
            //         missingValue.join(" and ")
            // )
        }

        if (!isMissingValues) {
            accessToken = `${hash['token_type']} ${hash['access_token']}`

            cookies.set('access_token', accessToken, {
                expires: ((today: Date, min: number) => {
                    return new Date(today.getTime() + min * 60000)
                })(new Date(), 59),
            })
            cookies.remove('spotify_auth_state')
        }
    }

    return accessToken
}
