import {createSocket} from 'dgram';
import {Buffer} from 'buffer';

/**
 * Пример клиента.
 * Клиент каждую секунду отправляет сообщение на '0.0.0.0'.
 * Сначала отправляет сообщение 'Hi'.
 * Если получен ответ, то отправляет сообщение '******' на адрес и порт, полученный в ответе.
 */

const client = createSocket('udp4');

let data = Buffer.from('Hi');
const server = {
    host: '0.0.0.0',
    port: 8889
};

client.on('message', (messageBuffer, remoteInfo) => {
    const json = JSON.parse(messageBuffer.toString());
    server.host = json.host;
    server.port = json.port;
    data = Buffer.from('******');
});

setInterval((
    () => {
        client.send(data, server.port, server.host, (
            error => {
                if (error) { 
                    client.close(); 
                }
            }
        ));
    }
), 1000);