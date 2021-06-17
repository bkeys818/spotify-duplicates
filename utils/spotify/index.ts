import authorize, { Token } from './authorize'
import { request, requestWithURL, SpotifyError } from './request'

const testToken = authorize()

export { authorize, request, requestWithURL, testToken }
export type { Token }
