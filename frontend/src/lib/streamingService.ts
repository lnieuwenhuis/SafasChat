interface StreamingOptions {
    model: string
    messages: Array<{ role: string; content: string }>
    apiKey: string
    reasoning?: boolean
    onChunk: (chunk: string) => void
    onReasoning?: (reasoning: string) => void
    onComplete: () => void
    onError: (error: Error) => void
}

interface RequestBody {
    model: string
    messages: Array<{ role: string; content: string }>
    stream: boolean
    reasoning?: {
        effort: string
        exclude: boolean
    }
}

export class StreamingService {
    private controller: AbortController | null = null

    async streamChat(options: StreamingOptions) {
        const { model, messages, apiKey, reasoning, onChunk, onComplete, onError } = options
        
        this.controller = new AbortController()
        
        try {
            const requestBody: RequestBody = {
                model,
                messages,
                stream: true,
            }

            // Add reasoning configuration if the model supports it
            if (reasoning) {
                requestBody.reasoning = {
                    effort: "medium",
                    exclude: false
                }
            }

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: this.controller.signal
            })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
            throw new Error('Response body is not readable')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        try {
            while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            while (true) {
                const lineEnd = buffer.indexOf('\n')
                if (lineEnd === -1) break

                const line = buffer.slice(0, lineEnd).trim()
                buffer = buffer.slice(lineEnd + 1)

                if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                    onComplete()
                    return
                }

                try {
                    const parsed = JSON.parse(data)
                    const content = parsed.choices[0]?.delta?.content
                    const reasoning = parsed.choices[0]?.delta?.reasoning
                    
                    if (content) {
                        onChunk(content)
                    }
                    
                    // Handle reasoning tokens separately
                    if (reasoning && options.onReasoning) {
                        options.onReasoning(reasoning)
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e)
                }
                }
            }
            }
        } finally {
            reader.cancel()
        }
        } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            onError(error)
        }
        }
    }

    abort() {
        if (this.controller) {
        this.controller.abort()
        this.controller = null
        }
    }
}