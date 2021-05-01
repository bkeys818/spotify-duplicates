import React from 'react'
import { render, screen } from '@testing-library/react'

import CoverImage, { filterImages, imageMin } from './CoverImage'
import * as Spotify from '../spotify'
import { modifyPlaylistObject } from './App'

describe('Function "modifyPlaylistObject" works as expected', () => {
    test(`Filters out images smaller than ${imageMin}px`, () => {
        expect(
            filterImages([
                {
                    url: 'height too small',
                    height: imageMin - 1,
                    width: imageMin + 1,
                },
                {
                    url: 'width too small',
                    height: imageMin + 1,
                    width: imageMin - 1,
                },
            ])?.url
        ).toBe(undefined)
    })

    test(`Chooses smallest Image above ${imageMin}px`, () => {
        expect(
            filterImages([
                {
                    url: 'Correct Image',
                    height: imageMin + 1,
                    width: imageMin + 1,
                },
                {
                    url: 'No smallest Image',
                    height: imageMin + 100,
                    width: imageMin + 100,
                },
            ])?.url
        ).toBe('Correct Image')
    })

    test('Uses image if no size is defined', () => {
        expect(
            filterImages([
                {
                    url: 'Correct Image',
                },
            ])?.url
        ).toBe('Correct Image')
    })
})

describe('Playlist component renders correctly', () => {
    let playlist: ReturnType<typeof modifyPlaylistObject>
    beforeAll(() => {
        return Spotify.authorize().then(token => {
            return Spotify.request('Get a Playlist', {
                token: token.token_type + ' ' + token.access_token,
                pathParameter: {
                    '{playlist_id}': '2oGXW218O4QdwjtKEEGKGP',
                },
            }).then(response => (playlist = modifyPlaylistObject(response)))
        })
    })

    test('Default state', () => {
        const Component = render(
            <CoverImage
                src={
                    'https://i.scdn.co/image/ab67706c0000bebb2272d38d7afa166cefa7d6d9'
                }
            />
        ).container.firstElementChild

        expect(Component).not.toHaveClass('empty')

        const imgSrc = Component?.firstElementChild?.getAttribute('src')
        expect(imgSrc).toMatch(
            /^https:\/\/(i\.scdn|mosaic\.scdn)\.co\/(image|\d+)\/[a-z\d]+$/
        )
    })

    test('No cover', () => {
        const Component = render(<CoverImage />).container.firstElementChild

        expect(Component).toHaveClass('empty')

        const imgSrc = Component?.firstElementChild?.getAttribute('src')
        expect(imgSrc).toBe('test-file-stub')
    })
})
