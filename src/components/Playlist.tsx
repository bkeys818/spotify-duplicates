import React from "react";

// @ts-ignore
import spotifyLogo from "../assets/spotify-logos/Spotify_Icon_RGB_White.png";
import "./Playlist.scss";


export type PlaylistProps = Pick<SimplifiedPlaylistObject, "name" | "images" | "tracks"> & {
    handleClick: React.MouseEventHandler<HTMLDivElement>
}

interface PlaylistState {
    tracks?: (SimplifiedTrackObject & {
        selected: boolean
    })[]
};
export default class Playlist extends React.Component<PlaylistProps, PlaylistState> {
    constructor(props: PlaylistProps) {
        super(props)
        this.state = {}
    }

    render() {
        const { handleClick, name, images } = this.props
        const cover = ((origImgs: ImageObject[]) => {
            const imgs = origImgs.map(img => {
                return {
                    url: img.url,
                    size: (img.height < img.width) ? img.height : img.width
                }
            }).filter(img => {
                if (img.size === null) return true
                return img.size >= 84 // px size
            })
            const coverSize = Math.max.apply(null, imgs.map(img => img.size))
            return imgs.find(img => {
                if (img.size === null) return true
                return img.size == coverSize
            })
        })(images)?.url;

        return (
            <div className="playlist" onClick={handleClick}>
                <div className={"cover" + (cover ? "" : " empty")}>
                    <img src={cover ?? spotifyLogo} alt="Album Cover" />
                </div>
                <p>{name}</p>
            </div>
        );
    }
}