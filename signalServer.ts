import {createSocket} from 'dgram';
import getInterfaceInfoExternalIp4 from './getInterfaceInfoExternalIp4';

/**
 * Пример сигнального сервера.
 * Слушает '0.0.0.0'.
 * Если получит сообщение 'Hi', то отправит в ответ адрес и порт основного сервера.
 */

const port = 8889;
const mainServerPort = 8888;

const localAddress = getInterfaceInfoExternalIp4()[0].address;
console.log('Local address', localAddress);

const server = createSocket('udp4');
 
server.on('close', () => console.log('Socket is closed!'));

server.on('error', error => {
    console.error(error);
    server.close();
});
 
server.on('message', (messageBuffer, remoteInfo) => {
    if (messageBuffer.toString() == 'Hi') {
        server.send(
            JSON.stringify({
                host: localAddress, 
                port: mainServerPort
            }), 
            remoteInfo.port, 
            remoteInfo.address
        );
    }
});
 
server.on('listening', () => {
    const {address, port} = server.address();
    console.log(`Server is listening at udp://${address}:${port}`);
});
 
 
server.bind(port, '0.0.0.0');