import React from "react"

import Track, { TrackProps } from "./Track"
import { ChevronRight, Selected, Xmark } from "../assets/svgs"

type UniqueSongInfo = TrackProps["song"] & { id: string }
export interface DuplicateTracksProps {
    original: UniqueSongInfo
    duplicates: UniqueSongInfo[]
}

export default (props: DuplicateTracksProps) => (
    <div>
        <Track
            song={{
                name: props.original.name,
                album: props.original.album,
                artist: props.original.artist,
            }}
            className="original"
            key={props.original.id}
            symbolRight={
                props.duplicates.length != 0 ? (
                    <ChevronRight
                        style={{
                            height: 22,
                            width: 22,
                        }}
                    />
                ) : undefined
            }
        />
        {props.duplicates.map(track => (
            <Track
                song={{
                    name: track.name,
                    album: track.album,
                    artist: track.artist,
                }}
                className="duplicate"
                key={track.id}
                // symbolLeft={<Selected style={{
                //     height: 18,
                //     width: 18
                // }}/>}
                symbolRight={
                    <Xmark
                        style={{
                            height: 18,
                            width: 18,
                        }}
                    />
                }
            />
        ))}
    </div>
)
