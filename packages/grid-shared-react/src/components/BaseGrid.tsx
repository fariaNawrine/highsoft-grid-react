/**
 * Grid React integration.
 * Copyright (c) 2025, Highsoft
 *
 * A valid license is required for using this software.
 * See highcharts.com/license
 *
 */

import { useRef, useImperativeHandle, forwardRef, ForwardedRef, ReactNode, useMemo } from 'react';
import {
    useGrid,
    GridType,
    GridInstance
} from '../hooks/useGrid';
import { processGridChildren, mergeOptionsWithChildConfig } from '../utils/processChildren';

/**
 * Ref handle exposed by Grid components
 */
export interface GridRefHandle<TOptions> {
    /**
     * Access to the underlying grid instance
     */
    readonly grid: GridInstance<TOptions> | null;
}

/**
 * Props for Grid component
 */
export interface GridProps<TOptions> {
    /**
     * Grid configuration options
     */
    options: TOptions;
    /**
     * Optional ref to access the grid instance
     */
    gridRef?: ForwardedRef<GridRefHandle<TOptions>>;
    /**
     * Optional callback to be called when the grid is initialized
     */
    callback?: (grid: GridInstance<TOptions>) => void;
    /**
     * Child components for declarative configuration (e.g., Pagination, Table)
     */
    children?: ReactNode;
}

/**
 * Props for BaseGrid component
 */
export interface BaseGridProps<TOptions> extends GridProps<TOptions> {
    /**
     * Grid instance (from @highcharts/grid-lite or @highcharts/grid-pro)
     */
    Grid: GridType<TOptions>;
}

export const BaseGrid = forwardRef(function BaseGrid<TOptions>(
    props: BaseGridProps<TOptions>,
    ref: ForwardedRef<GridRefHandle<TOptions>>
) {
    const { options, Grid, callback, children } = props;
    const containerRef = useRef<HTMLDivElement>(null);

    const mergedOptions = useMemo(() => {
        if (!children) return options;

        const childConfig = processGridChildren(children);
        return mergeOptionsWithChildConfig(options, childConfig);
    }, [options, children]);

    const currGridRef = useGrid({
        containerRef,
        options: mergedOptions,
        Grid,
        callback
    });

    useImperativeHandle(
        ref,
        () => ({
            get grid() {
                return currGridRef.current;
            }
        }),
        []
    );

    return <div ref={containerRef} />;
});
