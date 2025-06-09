import Dexie, { type Table } from 'dexie'

export interface Chat {
    id?: number
    title: string
    model: string
    createdAt: Date
    updatedAt: Date
    }

    export interface Message {
    id?: number
    chatId: number
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
    isStreaming?: boolean
    reasoning?: string 
}

    export class ChatDatabase extends Dexie {
    chats!: Table<Chat>
    messages!: Table<Message>

    constructor() {
        super('SafasChatDB')
        this.version(1).stores({
        chats: '++id, title, model, createdAt, updatedAt',
        messages: '++id, chatId, content, role, timestamp, isStreaming'
        })
    }
}

export const db = new ChatDatabase()