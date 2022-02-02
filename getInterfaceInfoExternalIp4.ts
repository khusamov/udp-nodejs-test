import {networkInterfaces, NetworkInterfaceInfo} from 'os';

/**
 * Получить список внешних IP4-адресов.
 */
export default function getInterfaceInfoExternalIp4(): NetworkInterfaceInfo[] {
    const result: NetworkInterfaceInfo[] = [];
    const interfaceList = networkInterfaces();
    for (const interfaceName in interfaceList) {
        if (interfaceList.hasOwnProperty(interfaceName)) {
            const interfaceInfoList = interfaceList[interfaceName];
            if (!interfaceInfoList) continue;
            for (const interfaceInfo of interfaceInfoList) {
                const {internal, family} = interfaceInfo;
                if (family.toLocaleLowerCase() === 'ipv4' && !internal) {
                    result.push(interfaceInfo);
                }
            }
        }
    }
    return result;
}


type TFilterNetworkInterfaceInfoPredicate = (value: NetworkInterfaceInfo, index: number, array: NetworkInterfaceInfo[]) => unknown;

function filterNetworkInterfaceInfo(predicate: TFilterNetworkInterfaceInfoPredicate): NodeJS.Dict<NetworkInterfaceInfo[]> {
    const result: NodeJS.Dict<NetworkInterfaceInfo[]> = {};
    const interfaceList = networkInterfaces();
    for (const interfaceName in interfaceList) {
        if (interfaceList.hasOwnProperty(interfaceName)) {
            const interfaceInfoList = interfaceList[interfaceName];
            if (!interfaceInfoList) continue;
            const filteredInterfaceInfoList = (interfaceInfoList.filter(predicate));
            if (filteredInterfaceInfoList.length > 0) {
                result[interfaceName] = filteredInterfaceInfoList;
            }
        }
    }
    return result;
}

function getNetworkInterfaceInfoExternalIp4() {
    return filterNetworkInterfaceInfo(
        ({family, internal}) => (
            family.toLocaleLowerCase() === 'ipv4' && !internal
        )
    );
}

function getFirstInterfaceInfo(interfaceList: NodeJS.Dict<NetworkInterfaceInfo[]>) {
    return getFirstValue(interfaceList);
}

function getFirstValue<T>(object: NodeJS.Dict<T>): T | undefined {
    let result: T | undefined;
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            result = object[key];
            break;
        }
    }
    return result;
}