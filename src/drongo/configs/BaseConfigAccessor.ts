import { IConfigAccessor } from "./core/IConfigAccessor";



/**
 * 配置存取器基类
 */
export class BaseConfigAccessor implements IConfigAccessor {

    protected $configs: Array<any> = [];

    constructor() {

    }

    Save(value: any): boolean {
        const index = this.$configs.indexOf(value);
        if (index >= 0) {
            return false;
        }
        this.$configs.push(value);
        return true;
    }

    /**
     * 获取
     * @param key
     * @param value
     * @returns 
     */
    GetElements<T>(): Array<T> {
        return this.$configs;
    }

    Destroy(): void {
        this.$configs = null;
    }
}