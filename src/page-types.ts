type LinkedProps<P extends object> = {
    location: Location & {
        state: P
    }
}
export type MaybeLinkedProps<P extends object> = LinkedProps<P> | { location: Location }