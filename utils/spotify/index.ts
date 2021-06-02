import authorize, { Token } from './authorize'
import { request, requestWithURL} from './request'

const testToken = authorize()

export { authorize, request, requestWithURL, testToken}
export type { Token }
