import React, { Component } from "react"

import { navigate } from "gatsby"
import Cookies from "universal-cookie"

import Playlist from "../components/Playlist"
import { request } from "../spotify/request"

import "./index.scss"

interface AppProps {
    location: Location
}
interface AppStates {
    accessToken?: string
    playlists: SimplifiedPlaylistObject[]
}

export default class App extends Component<AppProps, AppStates> {
    private readonly cookies = new Cookies()

    constructor(props: AppProps) {
        super(props)

        let accessToken = authenticate(props.location.hash)

        this.state = {
            accessToken: accessToken,
            playlists: [],
        }
    }

    componentDidMount() {
        if (!this.state.accessToken) navigate("/login/")
        window.location.hash = ""
        request("Get a List of Current User's Playlists", {
            token: this.state.accessToken ?? "",
        })
            .then(res => {
                this.setState({ playlists: res?.items ?? this.state.playlists })
            })
            .catch(console.error)
    }

    render() {
        return React.createElement("div", {
            className: "playlist-container"
        },
        ...this.state.playlists.map(playlist => (
            <Playlist
                key={playlist.id}
                name={playlist.name}
                images={playlist.images}
                tracks={playlist.tracks}
            />
        ))
        )
    }
}

function authenticate(hashStr: Location["hash"]) {
    const cookies = new Cookies()

    let accessToken = cookies.get<string | undefined>("access_token")

    if (!accessToken) {
        let isMissingValues = false

        const spotifyAuthState = cookies.get<string | undefined>(
            "spotify_auth_state"
        )

        const hash = Object.fromEntries(
            new Map(
                hashStr
                    .slice(1)
                    .split("&")
                    .map(value => {
                        return value.split("=")
                    }) as [string, string][]
            )
        )

        if (!(spotifyAuthState && "state" in hash)) {
            isMissingValues = true
            // const missingValue = []
            // if (!spotifyAuthState)
            //     missingValue.push('"spotify_auth_state" cookie')
            // if (!("state" in hash)) missingValue.push('"state" key in hash')

            // console.error(
            //     "Missing authentication values: " +
            //         missingValue.join(" and ")
            // )
        } else if (spotifyAuthState !== hash["state"]) {
            isMissingValues = true
            // console.error(
            //     "Autherize values unequal.",
            //     `spotify_auth_state = ${spotifyAuthState}`,
            //     `hash = ${hash["state"]}`
            // )
        }
        if (!("access_token" in hash && "token_type" in hash)) {
            isMissingValues = true
            const missingValue = []
            // if (!("access_token" in hash))
            //     missingValue.push('"access_token"')
            // if (!("token_type" in hash)) missingValue.push('"token_type"')

            // console.error(
            //     "Hash is missing token related keys: " +
            //         missingValue.join(" and ")
            // )
        }

        if (!isMissingValues) {
            accessToken = `${hash["token_type"]} ${hash["access_token"]}`

            cookies.set("access_token", accessToken, {
                expires: ((today: Date, min: number) => {
                    return new Date(today.getTime() + min * 60000)
                })(new Date(), 59),
            })
            cookies.remove("spotify_auth_state")
        }
    }

    return accessToken
}
