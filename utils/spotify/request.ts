import { EndpointInfo, endpointInfo, RequestParams, Response } from './api'
import fetch, { RequestInit } from 'node-fetch'

function request<R extends EndpointInfo<'name'>['name']>(
    /** The type of request */
    type: R,
    options: {
        /** The Spotify authentication token. */
        token: string
    } & RequestParams<R>
): Promise<Response<R>>

function request<R extends EndpointInfo<'url' | 'type' | 'name'>>(
    /** The request url. */
    url: R['url'],
    options: {
        /** The Spotify authentication token. */
        token: string
        /** The type of the request. */
        method: R['type']
    }
): Promise<Response<R>>

function request<R extends EndpointInfo<'name' | 'url' | 'type'>>(
    typeOrUrl: R['name'] | R['url'],
    options: {
        /** The Spotify authentication token. */
        token: string
    } & (RequestParams<R['name']> | {
        /** The type of the request. */
        method: R['type']
    })
): Promise<Response<R['name']>> {
    let url: string,
        info: RequestInit = {};

    if ('method' in options) {
        url = typeOrUrl
        info.method = options.method
    } else {
        const endpoint = endpointInfo[typeOrUrl as R['name']]

        url = 'https://api.spotify.com/v1/' + endpoint.url

        type dic = { [key: string]: string };
        if ('pathParamter' in options)
            for (let key in options['pathParamter'] as dic) {
                url = url.replace(key, options['pathParameter'][key])
            }
        if ('queryParameter' in options) {
            url += '?'
            for (const key in options['queryParameter'] as dic) {
                url += key + '=' + options['queryParameter'][key] + '&'
            }
            url.slice(0, -1)
        }
        if ('header' in options) {
            info.headers = options['header']
        }
        info.method = endpoint.type
        info.headers = {
            Authorization: options.token,
            ...info.headers
        }
    }

    return new Promise((resolve, reject) => {
        fetch(url, info).then(res => {
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
    })
}

export default request