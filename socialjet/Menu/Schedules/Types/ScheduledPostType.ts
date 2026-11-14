export default interface ScheduledPostType{
    id: number
    title: string
    link: string
    thumbnail?: string
    post_type?: string
    status?: string
    /** Publish date, `Y-m-d H:i` in site time. */
    date?: string
    shared_at?: string
    sharing_done?: boolean
}