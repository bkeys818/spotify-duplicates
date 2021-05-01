import { Names, requestInfo, RequestParams, Response } from './api'
import fetch from 'node-fetch'

export function request<R extends Names>(
    type: R,
    options: {
        token: string
    } & RequestParams<R>
) {
    const info = requestInfo[type]
    var url = 'https://api.spotify.com/v1/' + info.urlPath

    // @ts-ignore
    if ('pathParameter' in options) {
        for (const key in options['pathParameter'] as {
            [key: string]: string
        }) {
            // @ts-ignore
            url = url.replace(key, options['pathParameter'][key])
        }
    }
    // @ts-ignore
    if ('queryParameter' in options) {
        url += '?'
        for (const key in options['queryParameter'] as {
            [key: string]: string
        }) {
            // @ts-ignore
            url += key + '=' + options['queryParameter'][key] + '&'
        }
        url.slice(0, -1)
    }

    return new Promise((resolve: (value: Response<R>) => void, reject) => {
        fetch(url, {
            method: info.type,
            headers: {
                Authorization: options.token,
                ...(() => {
                    return 'header' in options ? options['header'] : {}
                })(),
            },
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
                            else reject('Uknown error during request.')
                        }
                    }
                }
            })
            .catch(reject)
    })
}
