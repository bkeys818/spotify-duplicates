import React, { Component } from 'react'

import App from '../components/App'

import { navigate } from 'gatsby'
import Cookies from 'universal-cookie'

interface IndexProps {
    location: Location
}
interface IndexStates {
    token?: string
}
export default class Index extends Component<IndexProps, IndexStates> {
    constructor(props: IndexProps) {
        super(props)
        this.state = {
            token: authenticate(props.location.hash),
        }
    }

    componentDidMount() {
        if (!this.state.token) navigate('/login/')
        window.location.hash = ''
    }

    render() {
        return <App accessToken={this.state.token!} />
    }
}

function authenticate(hashStr: Location['hash']) {
    const cookies = new Cookies()

    let accessToken = cookies.get<string | undefined>('access_token')

    if (!accessToken) {
        let isMissingValues = false

        const spotifyAuthState = cookies.get<string | undefined>(
            'spotify_auth_state'
        )

        const hash = Object.fromEntries(
            new Map(
                hashStr
                    .slice(1)
                    .split('&')
                    .map(value => {
                        return value.split('=')
                    }) as [string, string][]
            )
        )

        if (!(spotifyAuthState && 'state' in hash)) {
            isMissingValues = true
            // const missingValue = []
            // if (!spotifyAuthState)
            //     missingValue.push('"spotify_auth_state" cookie')
            // if (!("state" in hash)) missingValue.push('"state" key in hash')

            // console.error(
            //     "Missing authentication values: " +
            //         missingValue.join(" and ")
            // )
        } else if (spotifyAuthState !== hash['state']) {
            isMissingValues = true
            // console.error(
            //     "Autherize values unequal.",
            //     `spotify_auth_state = ${spotifyAuthState}`,
            //     `hash = ${hash["state"]}`
            // )
        }
        if (!('access_token' in hash && 'token_type' in hash)) {
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
            accessToken = `${hash['token_type']} ${hash['access_token']}`

            cookies.set('access_token', accessToken, {
                expires: ((today: Date, min: number) => {
                    return new Date(today.getTime() + min * 60000)
                })(new Date(), 59),
            })
            cookies.remove('spotify_auth_state')
        }
    }

    return accessToken
}
