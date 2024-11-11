import { useEffect } from 'react';

const ChatAssistant: React.FC = () => {
    useEffect(() => {
        const divElement = document.createElement('div');
        const iframe = document.createElement('iframe');

        divElement.appendChild(iframe);
        document.body.appendChild(divElement);

        if (iframe.contentWindow) {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(`
            <body>
                <script>
                document.addEventListener('DOMContentLoaded', function () {
                    const e = 'lipy-chat';
                    if (document.getElementById(e)) return;
                    const t = document.createElement('script');
                    t.id = e;
                    t.src = 'https://cdn.lipy.ai/packages/webchat.js';
                    t.onload = function () {
                        window.LipyWebchat({
                            apiKey: '2C704hhA1htlgGwcNssYOQYIJlAiZQ',
                            orgId: 'B9S96WvG4lV6vULk',
                        });
                    };
                    t.onerror = function () {
                        console.error('Failed to load the Lipy webchat script.');
                    };
                    document.body.appendChild(t);
                });
                </script>
            </body>
            `);
            iframe.contentWindow.document.close();
        }

        return () => {
            document.body.removeChild(divElement);
            const lipyWebchatDiv = document.getElementById('lipy-webchat');
            if (lipyWebchatDiv) {
                document.body.removeChild(lipyWebchatDiv);
            }
        };
    }, []);

    return null;
};

export default ChatAssistant;