import { randomBytes } from 'crypto';

export const wsUrlDemo = // [ WEBSOCKET URL FOR DEMO ]; EU/RUS, US NA or US SA servers based on your location
export const wsUrlReal = // [ WEBSOCKET URL FOR REAL ];

export const authMessageDemo = // [ WEBSOCKET AUTH MESSAGE FOR REAL DEMO ];
export const authMessageReal = // [ WEBSOCKET AUTH MESSAGE FOR REAL ACCOUNT ];
// latestactivity (probably the time of auth)

const generateSecWebSocketKey = () => {
    return randomBytes(16).toString('base64');
};

export const headers = {
    'Cache-Control': 'no-cache',
    'Connection': 'Upgrade',
    'Origin': 'https://pocketoption.com',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'websocket',
    'Sec-Fetch-Mode': 'websocket',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-WebSocket-Extensions': 'permessage-deflate',
    'Sec-WebSocket-Key': generateSecWebSocketKey(),
    'Sec-WebSocket-Version': '13',
    'Upgrade': 'websocket',
    'User-Agent': // [ USER AGENT DATA ]
};