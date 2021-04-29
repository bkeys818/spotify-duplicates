import React from "react"
import { render, screen } from "@testing-library/react"

import Playlist from "./Playlist"
import Spotify from "../spotify"

let playlist: PlaylistObject

beforeAll(() => {
    return Spotify.authorize().then(token => {
        return Spotify.request("Get a Playlist", {
            token: token.token_type + " " + token.access_token,
            pathParameter: {
                "{playlist_id}": "2oGXW218O4QdwjtKEEGKGP",
            },
        }).then(response => playlist = response)
    })
})

describe("Playlist component renders correctly", () => {

    test("Default", () => {
        const Component = render(
            <Playlist
                name={playlist.name}
                images={playlist.images}
                tracks={playlist.tracks}
            />
        ).container.firstElementChild

        const cover = Component?.getElementsByClassName("cover")[0]
        expect(cover).not.toHaveClass("empty")

        const imgSrc = cover?.firstElementChild?.getAttribute("src")
        expect(imgSrc).toMatch(/^https:\/\/(i\.scdn|mosaic\.scdn)\.co\/(image|\d+)\/[a-z\d]+$/)
    })

    test("No cover image big enough", () => {
        const images = playlist.images.filter(img => {
            let size = (img.height < img.width) ? img.height : img.width
            return size ? size < 84 : size
        })
        
        const Component = render(
            <Playlist
                name={playlist.name}
                images={images}
                tracks={playlist.tracks}
            />
        ).container.firstElementChild

        const cover = Component?.getElementsByClassName("cover")[0]
        expect(cover).toHaveClass("empty")

        const imgSrc = cover?.firstElementChild?.getAttribute("src")
        expect(imgSrc).toBe("test-file-stub")
    })
})
