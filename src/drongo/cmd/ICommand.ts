
export interface ICommand{

    /**
     * 执行
     */
    Execute(data:any):void;

    /**
     * 心跳
     * @param dt 
     */
    Tick(dt:number):void;
}