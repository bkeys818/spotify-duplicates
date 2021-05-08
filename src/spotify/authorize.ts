import fetch from 'node-fetch'

export interface Token {
    access_token: string
    token_type: 'Bearer'
    expires_in: number
}

interface AuthorizeParams {
    clientID: string
    clientSecret: string
}

export default function authorize(params?: AuthorizeParams) {
    return new Promise(function (resolve: (value: Token) => void, reject) {
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${params?.clientID ?? process.env.CLIENT_ID}:${params?.clientSecret ?? process.env.CLIENT_SECRET}`
                ).toString("base64")}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: encodeURIComponent('grant_type') + '=' + encodeURIComponent('client_credentials'),
        })
            .then(res => {
                if (res.status === 200) res.json().then(resolve)
                else {
                    try {
                        res.json().then(reject)
                    } catch {
                        try {
                            res.text().then(reject)
                        } catch {
                            if (res.statusText) reject(res.statusText)
                            else reject('Uknown error during authorization.')
                        }
                    }
                }
            })
            .catch(reject)
    })
}
