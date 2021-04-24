import { Names, requestInfo, RequestParams, Response } from "./api"
import fetch from "node-fetch"

export async function spotifyRequest<R extends Names>(
    type: R,
    options: {
        token: string
    } & RequestParams<R>
) {
    const info = requestInfo[type]
    var url = "https://api.spotify.com/v1/" + info.urlPath

    // @ts-ignore
    if ("pathParameter" in options) {
        for (const key in options["pathParameter"] as {
            [key: string]: string
        }) {
            // @ts-ignore
            url = url.replace(key, options["pathParameter"][key])
        }
    }
    // @ts-ignore
    if ("queryParameter" in options) {
        url += "?"
        for (const key in options["queryParameter"] as {
            [key: string]: string
        }) {
            // @ts-ignore
            url += key + "=" + options["queryParameter"][key] + "&"
        }
        url.slice(0, -1)
    }

    try {
        const response = await fetch(url, {
            method: info.type,
            headers: {
                Authorization: options.token,
                ...(() => {
                    return "header" in options ? options["header"] : {}
                })()
            }
        })
        if (response.status === 200) {
            const json = await response.json()
            return json as Response<R>
        } else {
            if (response.statusText) throw new Error(response.statusText)
            else {
                try {
                    const text = await response.text()
                    throw new Error(text)
                } catch {
                    throw new Error("Unknown error durring fetch")
                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}