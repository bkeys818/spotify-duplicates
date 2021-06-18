import React from 'react'
import { navigate } from 'gatsby'
import Cookies from 'universal-cookie'

import { request } from 'spotify-api-request'
import Playlist, { StaticPlaylist } from '../../utils/playlist'
import type { MaybeLinkedProps } from './page-types'

import { Track } from '../components/Track'


export interface PlaylistViewProps {
    token: string
    playlist: StaticPlaylist
}
interface PlaylistViewState
    extends Partial<Omit<Playlist, 'items'>>,
        Pick<Playlist, 'items'> {
    token: string
}

export default class PlaylistView extends React.Component<
    MaybeLinkedProps<PlaylistViewProps>,
    PlaylistViewState
> {
    private loadItems = Playlist.loadItems
    private findDuplicates = Playlist.findDuplicates

    constructor(props: MaybeLinkedProps<PlaylistViewProps>) {
        super(props)

        this.loadItems = this.loadItems.bind(this)
        this.findDuplicates = this.findDuplicates.bind(this)

        // redirect from other page
        if ('state' in props.location && props.location.state) {
            console.log(props.location.state)
            const { token, playlist } = props.location.state
            this.state = {
                token: token,
                ...Playlist.new(playlist),
                items: [],
            }
        }
        // page was refreshed or directed from unknown source
        else {
            const state: PlaylistViewState = {
                token: new Cookies().get('access_token') ?? 'unknown',
                items: [],
            }

            const match = props.location.search.match(/id=([a-zA-Z\d]+)/)
            if (match && 0 in match) state.id = match[0]

            this.state = state
        }
    }

    componentDidMount() {
        // missing crucial data
        if (this.state.token == 'unknown') navigate('/login/')
        if (!('id' in this.state))
            navigate('/')

        // load data
        ;(async () => {
            if (!('items' in this.state)) {
                const response = await request({
                    name: 'Get a Playlist',
                    token: this.state.token,
                    pathParameter: {
                        '{playlist_id}': this.state.id!,
                    },
                })
                this.setState(Playlist.new(response))
            }
        })().then(() => {
            return this.loadItems()
        })
    }

    render() {
        const { items, coverImage, name } = this.state
        return (
            <div id="playlist-view" style={{
                height: '100vh',
                width: '100vw'
            }}>
                {items.map((item, i) => (
                    <Track {...item} key={item.track.id + `-${i}`} />
                ))}
            </div>
        )
    }
}
