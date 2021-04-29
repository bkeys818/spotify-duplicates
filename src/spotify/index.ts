import { authorize, Token } from "./authorize";
import { request } from "./request";

const Spotify = {
    authorize: authorize,
    request: request
}
export default Spotify
export type { Token }