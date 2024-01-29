import { IConfigAccessor } from "./core/IConfigAccessor";



/**
 * 配置存取器基类
 */
export class BaseConfigAccessor implements IConfigAccessor {

    private __configs: Array<any> = [];

    constructor() {

    }
    
    Save(value: any): boolean {
        const index = this.__configs.indexOf(value);
        if (index >= 0) {
            return false;
        }
        this.__configs.push(value);
    }

    Get<T>(): Array<T> {
        return this.__configs;
    }

    Clear(): void {
        this.__configs.length = 0;
    }
}