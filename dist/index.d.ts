/// <reference types="react" />
export declare type PullableProperties = {
    children?: JSX.Element | null;
    onRefresh?: () => void;
    className?: string;
    centerSpinner?: boolean;
    fadeSpinner?: boolean;
    rotateSpinner?: boolean;
    spinnerSize?: number;
    spinnerOffset?: number;
    spinnerColor?: string;
    spinSpeed?: number;
    popDuration?: number;
    distThreshold?: number;
    resistance?: number;
    refreshDuration?: number;
    resetDuration?: number;
    resetEase?: string;
    shouldPullToRefresh?: () => boolean;
    disabled?: boolean;
};
declare const Pullable: ({ className, children, onRefresh, centerSpinner, fadeSpinner, rotateSpinner, spinnerSize, spinnerOffset, spinnerColor, spinSpeed, popDuration, distThreshold, resistance, refreshDuration, resetDuration, resetEase, shouldPullToRefresh, disabled, }: PullableProperties) => JSX.Element;
export default Pullable;
export { Pullable };
