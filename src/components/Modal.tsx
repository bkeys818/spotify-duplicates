import React from 'react'
import { CSSTransition } from 'react-transition-group'

import CoverImage from './CoverImage'
import Track from './Track'
import { ModifiedPlaylistObject } from './App'

import '../style/Modal.scss'

interface ModalProps {
    active: boolean
    handleClose: React.MouseEventHandler<HTMLDivElement>
    playlist?: ModifiedPlaylistObject
}

const className = 'modal'
export default function Modal(props: ModalProps) {
    console.log(props.playlist?.tracks.values)
    return (
        <CSSTransition classNames={className} in={props.active} timeout={500}>
            <div className={className} onClick={props.handleClose}>
                <div id="playlist-header">
                    <CoverImage src={props.playlist?.cover} />
                    <div>
                        <h3>{props.playlist?.name}</h3>
                        <div id="playlist-actions">
                            <p>Button 1</p>
                            <p>Button 2</p>
                            <p>Button 3</p>
                        </div>
                    </div>
                </div>
                <div id="tracks-container">
                    <Track title="Title" artist="Artist" album="Album"/>
                    {props.playlist?.tracks.values.map(playlistTrackObj => {
                        if ("album" in playlistTrackObj.track) {
                            const { name, artists, album } = playlistTrackObj.track;
                            return <Track title={name} artist={artists.map(artist => artist.name).join(", ")} album={album.name} />
                        }
                    })}
                </div>
            </div>
        </CSSTransition>
    )
}