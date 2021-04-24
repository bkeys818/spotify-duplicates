import React, { Component } from "react"

import { navigate } from "gatsby"
import Cookies from "universal-cookie"

interface AppProps {
    location: Location
}
interface AppStates {
    accessToken?: string
}

export default class App extends Component<AppProps, AppStates> {
    private readonly cookies = new Cookies()

    constructor(props: AppProps) {
        super(props)

        let accessToken = this.cookies.get<string | undefined>("access_token")

        if (!accessToken) {
            let isMissingValues = false

            const spotifyAuthState = this.cookies.get<string | undefined>(
                "spotify_auth_state"
            )

            const hash = Object.fromEntries(
                new Map(
                    props.location.hash
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

                this.cookies.set("access_token", accessToken, {
                    expires: ((today: Date, min: number) => {
                        return new Date(today.getTime() + min * 60000)
                    })(new Date(), 59),
                })
                this.cookies.remove("spotify_auth_state")
            }
        }

        this.state = {
            accessToken: accessToken,
        }

    }

    componentDidMount() {
        if (!this.state.accessToken) navigate("/login/");
        window.location.hash = ""
    }

    render() {
        return <h1>{this.state.accessToken}</h1>
    }
}