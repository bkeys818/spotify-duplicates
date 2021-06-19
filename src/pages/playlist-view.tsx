import React from 'react'
import { navigate } from 'gatsby'
import Cookies from 'universal-cookie'

import PageTemplate from '../template/Page'
import CoverImage from '../components/CoverImage'
import Button from '../components/Button'
import Track from '../components/Track'

import { request } from 'spotify-api-request'
import Playlist, { StaticPlaylist } from '../../utils/playlist'
import type { MaybeLinkedProps } from './page-types'

import '../style/PlaylistView.scss'

export interface PlaylistViewProps {
    token: string
    playlist: StaticPlaylist
}
interface PlaylistViewState
    extends Partial<Omit<Playlist, 'items'>>,
        Pick<Playlist, 'items'> {
    token: string
    currentAction: CurrentAction
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

        const state = {
            items: [],
            currentAction: undefined
        }

        // redirect from other page
        if ('state' in props.location && props.location.state) {
            const { token, playlist } = props.location.state
            this.state = {
                ...state,
                token: token,
                ...Playlist.new(playlist),
            }
        }
        // page was refreshed or directed from unknown source
        else {
            const match = props.location.search.match(/id=([a-zA-Z\d]+)/)

            this.state = {
                ...state,
                token: new Cookies().get('access_token') ?? 'unknown',
                id: (match && 0 in match) ? match[0] : undefined
            }
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
            <PageTemplate>
                <div id="playlist-actions">
                    <Button
                        onClick={() => {
                            this.setState({ currentAction: 'findDuplicates' })
                            this.findDuplicates()
                        }}
                    >find duplicates</Button>
                </div>
                <div id="playlist-header">
                    <CoverImage src={coverImage} />
                    <h4>{name}</h4>
                </div>
                <div id="track-list">
                    {items.map((item, i) => (
                        item &&
                        <Track
                            key={item.track.id + `-${i}`}
                            currentAction={this.state.currentAction}
                            {...item}
                        />
                    ))}
                </div>
            </PageTemplate>
        )
    }
}

export type CurrentAction = undefined | 'findDuplicates'
