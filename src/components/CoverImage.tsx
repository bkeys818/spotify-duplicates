import React from 'react'

// @ts-ignore
import spotifyLogo from '../assets/spotify-logos/Spotify_Icon_RGB_White.png'
import '../style/CoverImage.scss'

const CoverImage = ({ src }: { src?: string | null }) => (
    <div className={'cover' + (src === null ? ' empty' : '')}>
        <img
            src={src ?? (src === null ? spotifyLogo : undefined)}
            alt="Playlist Cover"
        />
    </div>
)
export default CoverImage
