import React, { useEffect } from 'react';

const ChatAssistant: React.FC = () => {
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            const existingScript = document.getElementById('lipy-chat')

            if (!existingScript) {
                const script = document.createElement('script')
                script.id = 'lipy-chat'
                script.src = 'https://cdn.lipy.ai/packages/webchat.js'
                script.async = true

                const initializeChatAssistant = () => {
                    (window as any).LipyWebchat({
                        apiKey: 'KKF3UhfOSoOgudBLIZOXGVjMTPdGry',
                        orgId: 'XZMtB00JaFbA5iCh',
                    })
                }

                script.onload = initializeChatAssistant
                document.body.appendChild(script)
            }
        }, 100)

        return () => {
            clearTimeout(debounceTimeout)
            const script = document.getElementById('lipy-webchat-script')
            if (script) {
                script.onload = null
                document.body.removeChild(script)
            }
        }
    }, [])

    return <></>
}

export default ChatAssistant;