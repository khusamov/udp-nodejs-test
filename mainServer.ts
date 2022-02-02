import {createSocket} from 'dgram';
import getInterfaceInfoExternalIp4 from './getInterfaceInfoExternalIp4';

/**
 * Пример основного сервера.
 * Просто эхо-сервер.
 */

const port = 8888;

const localAddress = getInterfaceInfoExternalIp4()[0].address;
console.log('Local address', localAddress);

const server = createSocket('udp4');
 
server.on('message', (msg, info) => console.log(`Message: ${msg.toString()}`));
server.on('close', () => console.log('Socket is closed!'));
 
server.on('error', error => {
    console.error(error);
    server.close();
});
 
server.on('listening', () => {
    const {address, port} = server.address();
    console.log(`Server is listening at udp://${address}:${port}`);
});

server.bind(port, localAddress);