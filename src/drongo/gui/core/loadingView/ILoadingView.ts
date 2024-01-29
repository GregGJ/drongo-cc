

/**
 * 加载界面
 */
export interface ILoadingView {

    /**
     * 更新
     * @param data 
     */
    ChangeData(data: { progress?: number, label?: string, tip?: string }): void;

    /**
     * 显示
     */
    Show(): void;

    /**
     * 隐藏
     */
    Hide(): void;
}