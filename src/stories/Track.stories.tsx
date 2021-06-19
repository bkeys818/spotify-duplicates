import React from 'react'
import { Meta } from './custom-storybook-types'
import { Story } from '@storybook/react'

import Track, { TrackProps } from '../components/Track'
import IndicatorSvg from '../assets/IndicatorSvg'

import Playlist from '../../utils/playlist'

const trackNames = [
    'Heartbeat',
    't h e . c l i m b . b a c k',
    'Retro (Rough)',
    'Chicken (feat. Toosii)',
    'Ghost Town',
    'Riri',
    'French Toast',
    't h e . c l i m b . b a c k-2',
    'Riri-2',
    'No Pressure Intro',
    'Riri-3',
    'Feels Like Summer',
] as const
type TrackName = typeof trackNames[number]
const trackIds: { [key in TrackName]: string } = {
    Heartbeat: '3WWAvWDBQANpJeNbvVbjMg',
    't h e . c l i m b . b a c k': '0FlfN5cbUUpIHCRH8X1M44',
    'Retro (Rough)': '1nRTH500HbZX8PYwT4ZMby',
    'Chicken (feat. Toosii)': '5MqbniRB0Q3qPVckYS5mge',
    'Ghost Town': '7vgTNTaEz3CsBZ1N4YQalM',
    Riri: '1BSUrMIGvz53oIJLwxklS6',
    'French Toast': '0TXK1dsiK9lkeaK6neSP2j',
    't h e . c l i m b . b a c k-2': '5lLNBIyjp72btcnrjBG751',
    'Riri-2': '1VjNQAm7bG3MLIC5Cwb508',
    'No Pressure Intro': '41hwbZ1yF705MxJ7H9bwEu',
    'Riri-3': '395F2vUxt1iktr4ls4q3n2',
    'Feels Like Summer': '7p4vHnYXkxlzvfePJVpcTr',
}
function getTrack(track: TrackName, playlist: Playlist) {
    const result = playlist.items.find(item => {
        return item.track.id === trackIds[track]
    })
    if (result) return result!
    else throw new Error(`Couldn't find track (${track})`)
}
interface CustomTrackProps extends Omit<TrackProps, 'track' | 'duplicates'> {
    track: TrackName
    duplicates?: TrackName[]
}

export default {
    title: 'Track',
    component: Track,
    subcomponents: { IndicatorSvg },
    argTypes: {
        track: {
            name: 'main track',
            defaultValue: 'Riri' as TrackName,
            control: {
                type: 'select',
                options: trackNames,
            },
        },
        duplicates: {
            defaultValue: ['Riri-2', 'Riri-3'] as TrackName[],
            control: {
                type: 'multi-select',
                options: trackNames,
            },
        },
        added_at: { table: { disable: true } },
        similarities: { table: { disable: true } },
    },
} as Meta<CustomTrackProps>

const Template: Story<CustomTrackProps> = (
    args: CustomTrackProps,
    { loaded: { playlist } }
) => {
    const mainTrack: TrackProps = getTrack(args.track, playlist),
        duplicates: TrackProps[] = []

    if (args.duplicates)
        for (const duplicate of args.duplicates) {
            duplicates.push(getTrack(duplicate, playlist))
        }

    return (
        <Track
            {...{
                ...mainTrack,
                duplicates: duplicates,
            }}
        ></Track>
    )
}

export const Default = Template.bind({})
Default.args = {
    track: 'Riri',
    duplicates: undefined,
}
Default.argTypes = {
    duplicates: {
        control: {
            type: 'none',
        },
    },
} as Meta<CustomTrackProps>['argTypes']

export const HasDuplicates = Template.bind({})
HasDuplicates.args = {
    ...Default.args,
    duplicates: ['Riri-2', 'Riri-3'],
}
