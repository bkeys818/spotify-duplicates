import React from 'react'
import CoverImage from './CoverImage'
import Track from './Track'

import Playlist from '../utils/Playlist'

import "../style/EditPlaylist.scss"

interface EditPlaylistProps {
    playlist?: Playlist
}

export default function EditPlaylist(props: EditPlaylistProps) {
    if (!props.playlist) return <div className="edit-playlist"></div>
    const { name, coverImage, tracks } = props.playlist
    return (
        <div className="edit-playlist">
            <div id="playlist-header">
                <CoverImage src={coverImage} />
                <div>
                    <h3>{name}</h3>
                    <div id="playlist-actions">
                        <p>Button 1</p>
                        <p>Button 2</p>
                        <p>Button 3</p>
                    </div>
                </div>
            </div>
            <div id="tracks-container">
                <Track title="Title" artist="Artist" album="Album"/>
                {tracks.map(TrackInPlaylist => {
                    // TODO - Build view for episode playlist
                    if ("album" in TrackInPlaylist.track) {
                        const { name, artists, album } = TrackInPlaylist.track;
                        return <Track title={name} artist={artists.map(artist => artist.name).join(", ")} album={album.name} />
                    }
                })}
            </div>
        </div>
    )
}