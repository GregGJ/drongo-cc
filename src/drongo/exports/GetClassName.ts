

/**
 * 获取类名
 * @param clazz 
 * @returns 
 */
export function GetClassName(clazz: any): string {
    let className: string;
    if (typeof clazz != "string") {
        className = clazz.toString();
        className = className.replace("function ", "");
        let index: number = className.indexOf("()");
        if (index < 0) {
            throw new Error("获取类型名称错误：" + className);
        }
        className = className.substring(0, index);
    } else {
        className = clazz;
    }
    return className;
}