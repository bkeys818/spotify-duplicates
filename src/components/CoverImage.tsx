import React from 'react'

// @ts-ignore
import spotifyLogo from '../assets/spotify-logos/Spotify_Icon_RGB_White.png'
import '../style/CoverImage.scss'

const CoverImage =({ src }: { src?: string }) => (
    <div className={'cover' + (src ? '' : ' empty')}>
        <img src={src ?? spotifyLogo} alt="Playlist Cover" />
    </div>
)
export default CoverImage