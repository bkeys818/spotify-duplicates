import React from 'react'
import { navigate } from 'gatsby'
import Cookies from 'universal-cookie'
import Playlist, { StaticPlaylist } from '../../utils/playlist'

import TrackList from '../components/TrackList'
import { request } from '../../utils/spotify'

interface EditPlaylistProps {
    token: string
    playlist: StaticPlaylist
}
export type EditPlaylistStates = (Partial<Playlist> | Playlist) & {
    token: string
}

export default class EditPlaylist extends React.Component<
    MaybeLinkedProps<EditPlaylistProps>,
    EditPlaylistStates
> {
    private loadItems = Playlist.loadItems
    private findDuplicates = Playlist.findDuplicates

    constructor(props: MaybeLinkedProps<EditPlaylistProps>) {
        super(props)
        if ('state' in props.location) {
            const { token, playlist } = props.location.state
            this.state = {
                token: token,
                ...Playlist.new(playlist)
            }
        } else {
            this.state = {
                token: new Cookies().get<string | undefined>('access_token') ?? ''
            }
        }

        this.loadItems = this.loadItems.bind(this)
        this.findDuplicates = this.findDuplicates.bind(this)
    }

    componentDidMount() {
        const playlist = (async () => {
            if (!this.state.items) {
                if (this.state.token == '') navigate('/login/')
    
                const id = new URL(location.href).searchParams.get('id')
                if (!id) navigate('/')
                else {
                    const response = await request('Get a Playlist', {
                        token: this.state.token,
                        pathParameter: {
                            '{playlist_id}': id,
                        },
                    })
                    this.setState(Playlist.new(response))
                }
            }
        })().then(() => {
            return this.loadItems()
        })
    }

    render() {
        if (this.state.items) {
            const { items } = this.state
            return (
                <div style={{
                    margin: '5%'
                }}>
                    <h2 onClick={this.findDuplicates} >Filter</h2>
                    {items.length > 0 && <TrackList items={items} />}
                </div>
            )
        } else return (
            <div>Loading</div>
        )
    }
}


type LinkedProps<P extends object> = {
    location: Location & {
        state: P
    }
}
type MaybeLinkedProps<P extends object> = LinkedProps<P> | { location: Location }
export type EditPlaylistLinkProps = LinkedProps<EditPlaylistProps>['location']['state']