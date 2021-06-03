import authorize, { Token } from './authorize'
import { request, requestWithURL, SpotifyError } from './request'

const testToken = authorize().catch(err => {
    if (
        err instanceof SpotifyError &&
        err.type == 'authorization' &&
        window.location.reload
    )
        window.location.reload()
    else throw err
})

export { authorize, request, requestWithURL, testToken }
export type { Token }
