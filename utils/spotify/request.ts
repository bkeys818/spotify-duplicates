import { endpoints, Names, EndpointsInfo, RequestParams, Response } from './api'
import type { Token } from './authorize'
import fetch, * as Fetch from 'node-fetch'

export async function request<N extends Names>(
    name: N,
    options: {
        /** The Spotify authentication token. */
        token: string | Token
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
        Authorization:
            typeof options.token == 'string'
                ? options.token
                : `${options.token.token_type} ${options.token.access_token}`,
        ...reqOptions.headers,
    }
    reqOptions.method = endpoints[name].method

    try {
        return await sendRequest(url, reqOptions)
    } catch (error) {
        throw error
    }
}

export async function requestWithURL<E extends EndpointsInfo>({
    url,
    method,
    token,
}: E & { token: string | Token }): Promise<Response<E>> {
    return await sendRequest(url, {
        headers: {
            Authorization:
                typeof token == 'string'
                    ? token
                    : `${token.token_type} ${token.access_token}`,
        },
        method: method,
    })
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
    } catch (error) {
        if (error instanceof SpotifyError) throw error
        else throw new SpotifyError('Uknown error.', 'unknown', error)
    }
}


type ErrorType = keyof typeof SpotifyError.Type

export class SpotifyError extends Error {
    constructor(message: string, type: ErrorType)
    constructor(message: string, type: ErrorType, ...data: any[])
    constructor(message: string, type: 'unknown', internalError: any)

    constructor(message: string, type: ErrorType, dataOrSystemError?: any) {
        super(message)
        this.name = 'SpotifyError'
        this.type = type
        if (dataOrSystemError) {
            if (type === 'unknown')
                this.internalError = dataOrSystemError
            else this.data = dataOrSystemError
        }
    }

    /** Error type for machine */
    readonly type: ErrorType
    /** For Node.js system error */
    readonly internalError?: any

    readonly data?: any[]

    log() {
        let log = `${this.name} - ${SpotifyError.Type[this.type]}! ${this.message}`
        if (this.internalError) console.error(log, this.internalError)
        else if (this.data) console.error(log, ...this.data)
        else console.error(log)
    }

    static readonly errorDetails: {
        [code: number]: {
            type: ErrorType
            message: string
        }
    } = {
        304: {
            type: 'request',
            message: 'Not Modified: See Conditional requests.',
        },
        403: {
            type: 'request',
            message: 'Forbidden: The server understood the request, but is refusing to fulfill it.',
        },
        429: {
            type: 'request',
            message: 'Too Many Requests: Rate limiting has been applied.',
        },
        204: {
            type: 'system',
            message: 'No Content: The request has succeeded but returns no message body.',
        },
        404: {
            type: 'system',
            message: 'Not Found: The requested resource could not be found. This error can be due to a temporary or permanent condition.',
        },
        500: {
            type: 'api',
            message: 'Internal Server Error: You should never receive this error because our clever coders catch them all … but if you are unlucky enough to get one, please report it to us through a comment at the bottom of this page.',
        },
        502: {
            type: 'api',
            message: 'Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
        },
        503: {
            type: 'api',
            message: 'Service Unavailable: The server is currently unable to handle the request due to a temporary condition which will be alleviated after some delay. You can choose to resend the request again.',
        },
    }

    static readonly Type = {
        system: 'Internal error',
        authorization: 'Failed to authorize',
        api: 'Failure in API',
        request: 'Inavlid request',
        unknown: 'Unknown error',
    } as const
}

/** Checks status, and if error is found, a SpotifyError is returned */
async function checkStatus(res: Fetch.Response) {
    if (res.status === 200 || res.status === 201 || res.status === 202) return
    if (res.status === 400 || res.status === 401) {
        const message = ((await res.json()).error as RegularError).message
        if (res.status === 401 || message === 'Only valid bearer authentication supported') {
            return new SpotifyError( 'Unauthorized: ' + message, 'authorization', res.headers.get('Authorization'))
        }
        return new SpotifyError('Bad Request: ' + message, 'request')
    }

    if (res.status in SpotifyError.errorDetails) {
        const info = SpotifyError.errorDetails[res.status]
        return new SpotifyError(info.message, info.type)
    }

    return new SpotifyError(`Unknown status code (${res.status})`, 'unknown')
}