import { FSM } from "./FSM";



    /**
     * 状态接口
     */
    export interface IState {
        name: string;
        /**初始化 */
        Init(content: FSM): void;
        /**进入 */
        Enter(data?:any): void;
        /**心跳 */
        Tick(dt: number): void;
        /**退出 */
        Exit(): void;
        /**销毁 */
        Destroy():void;
    }