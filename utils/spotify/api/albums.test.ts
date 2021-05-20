import { authorize, request, requestWithURL } from '../'
import { endpoints, RequestParams, Names, Response } from './albums'

const albumID = '7gsWAHLeT0w7es6FofOXk1'
let token: string

const requetsByName: { [key in Names]: RequestParams<key> } = {
    'Get an Album': {
        pathParameter: {
            '{id}': albumID,
        },
    },
    'Get Multiple Albums': {
        queryParameter: {
            ids: albumID,
        },
    },
    "Get an Album's Tracks": {
        pathParameter: {
            '{id}': albumID,
        },
    },
}

describe('Album requests', () => {
    beforeAll(() => {
        return authorize().then(res => {
            token = res.token_type + ' ' + res.access_token
        })
    })

    test.each(Object.entries(endpoints))('%s', async (name, endpoint) => {
        const responses = []
        responses.push(await request(name as Names, {
            token: token,
            ...requetsByName[name as Names]
        }))

        if (endpoint.url.includes('{id}'))
            responses.push(await requestWithURL({
                // @ts-ignore
                url: endpoint.url.replace('{id}', albumID),
                method: endpoint.method,
                token: token
            }))

        
        responses.forEach(res => {
            let property: [string, any] = 
                ((name as Names == 'Get an Album')
                ? ['album_type', 'album']
                : (name as Names == 'Get Multiple Albums')
                    ? ['albums', expect.any(Array)]
                    : (name as Names == "Get an Album's Tracks")
                        ? ['items', expect.any(Array)]
                        : ['error', null])

            expect(res).toHaveProperty(...property)
        })
    })

})
