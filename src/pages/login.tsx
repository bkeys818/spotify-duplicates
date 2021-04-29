import React from "react"
import Cookies from "universal-cookie"


export default (props: { location: Location }) => 
    <h1 onClick={() => login(props.location)}>Get Started</h1>

const scopes = [
    "user-library-modify",
    "playlist-modify-private"
]

function login(location: Location) {
    const cookies = new Cookies()

    const state = ((len: number) => {
        var R = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~".split(""),i,s = ""
        for (i = 0; i < len; i++) s += R[Math.floor(Math.random() * R.length)]
        return s
    })(18)

    cookies.set("spotify_auth_state", state)
    
    window.location.href = 
        "https://accounts.spotify.com/authorize?" +
            "client_id=" + process.env.CLIENT_ID +
            "&response_type=" + "token" +
            "&redirect_uri=" + encodeURI(location.origin) +
            "&state=" + state +
            "&scope=" + scopes.join(" ")
}