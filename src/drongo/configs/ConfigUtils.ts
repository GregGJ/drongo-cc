import { ByteArray } from "../utils/ByteArray";



export class ConfigUtils {

    /**
     * 解析配置
     * @param titleList 
     * @param typeList 
     * @param byte 
     * @returns 
     */
    static ParseConfig(titleList: Array<string>, typeList: Array<number>, byte: ByteArray): any {
        let title: string;
        let type: number;
        let result: any = {};
        for (let index = 0; index < typeList.length; index++) {
            title = titleList[index];
            type = typeList[index];
            switch (type) {
                case -1://nuil
                    break;
                case 0: //byte
                case 1://ubyte
                case 2: //short
                case 3: //ushort
                case 4: //int
                case 5: //uint
                case 6: //float
                case 7: //number
                    this.__readNumber(title, type, result, byte);
                    break;
                case 8: //string
                    result[title] = byte.ReadUTF();
                    break;
                case 9: //[byte]
                case 10://[ubyte]
                case 11: //[short]
                case 12: //[ushort]
                case 13: //[int]
                case 14: //[uint]
                case 15: //[float]
                case 16: //[number]
                case 17: //[string]
                    this.__readArray(title, type, result, byte);
                    break;
                default:
                    break;
            }
        }
        return result;
    }
    private static __readNumber(title: string, type: number, data: any, byte: ByteArray): void {
        switch (type) {
            case 0: //byte
                data[title] = byte.ReadByte();
                break;
            case 1://ubyte
                data[title] = byte.ReadUnsignedByte();
                break;
            case 2: //short
                data[title] = byte.ReadShort();
                break;
            case 3: //ushort
                data[title] = byte.ReadUnsignedShort();
                break;
            case 4: //int
                data[title] = byte.ReadInt();
                break;
            case 5: //uint
                data[title] = byte.ReadUnsignedInt();
                break;
            case 6: //float
                data[title] = byte.ReadFloat();
                break;
            case 7: //number
                data[title] = byte.ReadDouble();
                break;
            default:
                throw new Error(title + ' 未知类型:' + type);
        }
    }

    private static __readArray(title: string, type: number, data: any, byte: ByteArray): void {
        let len: number = byte.ReadUnsignedInt();
        let list = [];
        for (let index = 0; index < len; index++) {
            switch (type) {
                case 9: //byte
                    list.push(byte.ReadByte());
                    break;
                case 10://ubyte
                    list.push(byte.ReadUnsignedByte());
                    break;
                case 11: //short
                    list.push(byte.ReadShort());
                    break;
                case 12: //ushort
                    list.push(byte.ReadUnsignedShort());
                    break;
                case 13:
                    list.push(byte.ReadInt());
                    break;
                case 14:
                    list.push(byte.ReadUnsignedInt());
                    break;
                case 15:
                    list.push(byte.ReadFloat());
                    break;
                case 16:
                    list.push(byte.ReadDouble());
                    break;
                case 17:
                    list.push(byte.ReadUTF());
                    break;
                default:
                    throw new Error(title + ' 未知类型:' + type);
            }
        }
        data[title] = list;
    }
}