import { endpoints, Names, EndpointsInfo, RequestParams, Response } from './api'
import fetch, * as Fetch from 'node-fetch'

export async function request<N extends Names>(
    name: N,
    options: {
        /** The Spotify authentication token. */
        token: string
    } & RequestParams<N>
): Promise<Response<N>> {
    let url: string = endpoints[name].url
    type dic = { [key: string]: string }
    if ('pathParameter' in options)
        // @ts-ignore
        for (let key in options['pathParameter']) {
            // @ts-ignore
            url = url.replace(key, options['pathParameter'][key])
        }
    if ('queryParameter' in options) {
        url += '?'
        // @ts-ignore
        for (let key in options['queryParameter']) {
            // @ts-ignore
            url += key + '=' + options['queryParameter'][key] + '&'
        }
        url.slice(0, -1)
    }

    const reqOptions: Fetch.RequestInit = {}
    if ('header' in options) {
        reqOptions.headers = options['header']
    }
    reqOptions.headers = {
        Authorization: fixToken(options.token),
        ...reqOptions.headers,
    }
    reqOptions.method = endpoints[name].method

    try {
        return await sendRequest(url, reqOptions)
    } catch(error) {
        throw error
    }
}

export async function requestWithURL<E extends EndpointsInfo>({
    url,
    method,
    token,
}: E & { token: string }): Promise<Response<E>> {
    return await sendRequest(url, {
        headers: {
            Authorization: fixToken(token),
        },
        method: method,
    })
}

function fixToken(value: string) {
    if (!value.startsWith('Bearer ')) value = 'Bearer ' + value
    return value
}

async function sendRequest<R extends Names | EndpointsInfo>(
    url: string,
    options: Fetch.RequestInit
): Promise<Response<R>> {
    try {
        const res = await fetch(url, options)

        const error = await checkStatus(res)
        if (error) throw error

        const json = await res.json()
        if (json) return json as Response<R>
        return undefined as Response<R>

    } catch(error) {
        if (error instanceof SpotifyError) throw error
        else throw new SpotifyError("Uknown error.", ErrorTypes.unknown, error)
    }
}


enum ErrorTypes {
    system = "Internal error",
    authorization = "Failed to authorize",
    api = "Failure in API",
    request = "Inavlid request",
    unknown = "Unknown error"
}

class SpotifyError extends Error {
    constructor(message: string, type: ErrorTypes)
    constructor(message: string, type: ErrorTypes.unknown, internalError: any)

    constructor(message: string, type: ErrorTypes, systemError?: any) {
        super(`SpotifyError - ${type}! ${message}`)
        this.name = 'SpotifyError'
        this.type = type
        if (systemError) {
            this.internalError = systemError
        }
    }

    /** Error type for machine */
    readonly type: ErrorTypes
    /** For Node.js system error */
    readonly internalError?: any
}

/** Checks status, and if error is found, a SpotifyError is returned */
async function checkStatus(res: Fetch.Response) {
    // no error
    if (res.status >= 200 && res.status <= 202) return
    // authorization error
    if (res.status === 401) {
        const errorObj = (await res.json()).error as RegularError
        return new SpotifyError(`Unauthorized: ${errorObj.message}`, ErrorTypes.authorization)
    }
    // request error 
    if (res.status === 400) {
        const errorObj = (await res.json()).error as RegularError
        return new SpotifyError(`Bad Request: ${errorObj.message}`, ErrorTypes.request)
    }
    if (res.status === 304) return new SpotifyError('Not Modified: See Conditional requests.', ErrorTypes.request)
    if (res.status === 403) return new SpotifyError('Forbidden: The server understood the request, but is refusing to fulfill it.', ErrorTypes.request)
    if (res.status === 429) return new SpotifyError('Too Many Requests: Rate limiting has been applied.', ErrorTypes.request)
    // internal error
    if (res.status === 204) return new SpotifyError('No Content: The request has succeeded but returns no message body.', ErrorTypes.system)
    if (res.status === 404) return new SpotifyError('Not Found: The requested resource could not be found. This error can be due to a temporary or permanent condition.', ErrorTypes.system)
    // api error
    if (res.status === 500) return new SpotifyError('Internal Server Error: You should never receive this error because our clever coders catch them all … but if you are unlucky enough to get one, please report it to us through a comment at the bottom of this page.', ErrorTypes.api)
    if (res.status === 502) return new SpotifyError('Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.', ErrorTypes.api)
    if (res.status === 503) return new SpotifyError('Service Unavailable: The server is currently unable to handle the request due to a temporary condition which will be alleviated after some delay. You can choose to resend the request again.', ErrorTypes.api)
    // unknown error
    return new SpotifyError(`Unknown status code (${res.status})`, ErrorTypes.unknown)
}