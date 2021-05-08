import React from 'react'
import Playlist from '../utils/Playlist'


export interface EditPlaylistProps {
    token: string
    playlist: Playlist
}
interface EditPlaylistStates {}

type LinkedProps<P extends object> = {
    location: Location & {
        state: P
    }
}

export default class EditPlaylist extends React.Component<LinkedProps<EditPlaylistProps>, EditPlaylistStates> {
    constructor(props: LinkedProps<EditPlaylistProps>) {
        super(props)
    }
    render() {
        const { name } = this.props.location.state.playlist
        return (
            <h1>{name}</h1>
        )
    }
}