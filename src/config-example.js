import { randomBytes } from 'crypto';

export const wsUrlDemo = 'wss://demo-api-eu.po.market/socket.io/?EIO=4&transport=websocket';
export const wsUrlReal = // [ WEBSOCKET URL FOR REAL ]; EU/RUS, US NA or US SA servers based on your location

export const authMessageDemo = // [ WEBSOCKET AUTH MESSAGE FOR REAL DEMO ];
export const authMessageReal = // [ WEBSOCKET AUTH MESSAGE FOR REAL ACCOUNT ];
// wsUrlReal example: `42["auth",{"session":"a:4:{s:10:\\\"session_id\\\";s:32:\\\"086dcefsdfd01eweffwefwf1ee956fd\\\";s:10:\\\"ip_address\\\";s:12:\\\"185.1.1.1\\\";s:10:\\\"user_agent\\\";s:117:\\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 14_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15\\\";s:13:\\\"last_activity\\\";i:1442896190;}b4912fd6341fqeq1231239d6e6fe796b778115eb","isDemo":0,"uid":84890061,"platform":1}]`;
// Use 3 backslashes "\\\" 

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