import { Injector } from "../../../utils/Injector";
import { ILoadingView } from "./ILoadingView";



/**
 * 加载界面
 */
export class LoadingView {

    static KEY: string = "drongo.LoadingView";

    static Show(): void {
        if (!this.impl) {
            return;
        }
        this.impl.Show();
    }

    static Hide(): void {
        if (!this.impl) {
            return;
        }
        this.impl.Hide();
    }

    static ChangeData(data: { progress?: number, label?: string, tip?: string }): void {
        if (!this.impl) {
            return;
        }
        this.impl.ChangeData(data);
    }

    private static __impl: ILoadingView;
    static get impl(): ILoadingView {
        if (this.__impl == null) {
            this.__impl = Injector.GetInject(this.KEY);
        }
        if (this.__impl == null) {
            console.warn(this.KEY + "未注入");
        }
        return this.__impl;
    }
}