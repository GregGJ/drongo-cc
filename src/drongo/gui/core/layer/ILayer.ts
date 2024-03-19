
export interface ILayer {
    AddChild(child: any): void;

    AddChildAt(child: any, index: number): void;

    RemoveChild(child: any): void;

    RemoveChildAt(index: number): void;

    /**
     * 获取指定索引内容
     * @param index 
     */
    GetChildAt(index: number): any;
    /**
     * 当前层拥有的子对象数量
     */
    GetCount(): number;
}