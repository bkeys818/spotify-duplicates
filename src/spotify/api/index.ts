export type RequestInfo<Names extends string> = {
    [key in Names]: {
        readonly type: "GET" | "PUT" | "DELETE"
        readonly urlPath: string
    }
}

import * as Albums from "./albums"
// import * as Artists from "./artists"
// import * as Browse from "./browse"
// import * as Episodes from "./episodes"
// import * as Follow from "./follow"
// import * as Library from "./library"
// import * as Markets from "./markets"
// import * as Personalization from "./personalization"
// import * as Player from "./player"
// import * as Playlists from "./playlists"
// import * as Serach from "./serach"
// import * as Shows from "./shows"
// import * as Tracks from "./tracks"
// import * as UserProfile from "./user-profile"

export type Names = 
    | Albums.Names


export const requestInfo: RequestInfo<Names> = {
    ...Albums.requestInfo
}

export type RequestParams<R extends Names> = 
    R extends Albums.Names ? Albums.RequestParams<R>
    : {};

export type Response<R extends Names> = 
    R extends Albums.Names ? Albums.Response<R>
    : never;