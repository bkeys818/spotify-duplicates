export async function getTracks(url: string, token: string) {
    const tracks: PlaylistTrackObject[] = []
    try {
        const response = await fetch(url , {
            // mode: 'no-cors',
            headers: {
                Authorization: token
            }
        })
        if (!response.ok) {
            // TODO - Throw detailed error
            console.error(response.statusText)
            response.json().then(console.error)
            throw new Error('Error fetching Tracks')
        }
        const pagingObj = await response.json() as PagingObject<PlaylistTrackObject>
        tracks.push(...pagingObj.items)

        if (pagingObj.next) {
            // REVIEW - Remove await?
            // If I remove await, will the component still refresh when the reset of the tracks are added?
            await getTracks(pagingObj.next, token)
        }

        return tracks
    } catch(err) {
        if (err instanceof Error) throw err
        else throw new Error(err)
    }
}