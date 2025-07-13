export interface AccountType{
    id: number
    title: string
    provider: string
    session_id: number
    account_id: string
    picture?: string
    link?: string
    type?: string
    secrets?:object
    data?:object
    expires_at?: string
    is_expired?: boolean
}