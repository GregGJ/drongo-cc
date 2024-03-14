


export class ChangedData {
    public key: number | string;
    public newValue: any;
    public oldValue: any;

    constructor() {

    }

    public static Create(newValue?: any, oldValue?: any, key?: number | string): ChangedData {
        let result: ChangedData = new ChangedData();
        result.oldValue = oldValue;
        result.newValue = newValue;
        result.key = key;
        return result;
    }
}