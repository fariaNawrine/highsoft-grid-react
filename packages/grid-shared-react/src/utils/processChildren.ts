import { ReactNode, Children, isValidElement, ReactElement } from 'react';
import { PaginationProps, PaginationPosition } from '../components/Pagination';
import { TableProps } from '../components/Table';

/**
 * Extracted configuration from child components
 */
export interface ExtractedChildConfig {
    pagination?: {
        enabled: boolean;
        pageSize?: number;
        position?: PaginationPosition;
        controls?: {
            pageButtons?: boolean;
            pageSizeSelector?: boolean;
        };
    };
}

/**
 * Type guard to check if an element is a Pagination component
 */
function isPaginationComponent(
    element: ReactElement
): element is ReactElement<PaginationProps> {
    return (
        typeof element.type === 'function' &&
        (element.type as { __isPaginationComponent?: boolean }).__isPaginationComponent === true
    );
}

/**
 * Type guard to check if an element is a Table component
 */
function isTableComponent(
    element: ReactElement
): element is ReactElement<TableProps> {
    return (
        typeof element.type === 'function' &&
        (element.type as { __isTableComponent?: boolean }).__isTableComponent === true
    );
}

/**
 * Recursively find Pagination components in children (including nested in Table)
 */
function findPaginationInChildren(children: ReactNode): ReactElement<PaginationProps> | null {
    let found: ReactElement<PaginationProps> | null = null;

    Children.forEach(children, (child) => {
        if (!isValidElement(child) || found) return;

        if (isPaginationComponent(child)) {
            found = child;
        } else if (isTableComponent(child) && child.props.children) {
            found = findPaginationInChildren(child.props.children);
        }
    });

    return found;
}

/**
 * Determine pagination position based on child component order.
 * 
 * @param children - React children from the Grid component
 * @param paginationElement - The found Pagination element
 * @returns The determined position
 */
function determinePaginationPosition(
    children: ReactNode,
    paginationElement: ReactElement<PaginationProps>
): PaginationPosition {
    // Explicit position prop takes precedence
    if (paginationElement.props.position) {
        return paginationElement.props.position;
    }

    let tableIndex = -1;
    let paginationIndex = -1;
    let isNestedInTable = false;
    let index = 0;

    Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;

        if (isTableComponent(child)) {
            tableIndex = index;
            // Check if pagination is nested inside this Table
            if (child.props.children) {
                Children.forEach(child.props.children, (nestedChild) => {
                    if (isValidElement(nestedChild) && isPaginationComponent(nestedChild)) {
                        isNestedInTable = true;
                    }
                });
            }
        } else if (isPaginationComponent(child)) {
            paginationIndex = index;
        }

        index++;
    });

    if (isNestedInTable) {
        return 'footer';
    }

    if (tableIndex === -1) {
        return 'bottom';
    }

    return paginationIndex < tableIndex ? 'top' : 'bottom';
}

/**
 * Process Grid children to extract configuration.
 * 
 * This function iterates through child components (Pagination, Table)
 * and extracts their props to build a configuration object that can
 * be merged with the grid options.
 * 
 * @param children - React children from the Grid component
 * @returns Extracted configuration object
 */
export function processGridChildren(children: ReactNode): ExtractedChildConfig {
    const config: ExtractedChildConfig = {};
    let paginationCount = 0;

    const paginationElement = findPaginationInChildren(children);

    Children.forEach(children, (child) => {
        if (isValidElement(child)) {
            if (isPaginationComponent(child)) {
                paginationCount++;
            } else if (isTableComponent(child) && child.props.children) {
                Children.forEach(child.props.children, (nestedChild) => {
                    if (isValidElement(nestedChild) && isPaginationComponent(nestedChild)) {
                        paginationCount++;
                    }
                });
            }
        }
    });

    if (paginationCount > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
            '[Grid] Multiple <Pagination /> components detected. ' +
            'Only one Pagination component is supported. ' +
            'Using the first one found.'
        );
    }

    if (paginationElement) {
        const { pageSize, controls } = paginationElement.props;
        const position = determinePaginationPosition(children, paginationElement);

        config.pagination = {
            enabled: true,
            pageSize,
            position,
            controls: controls ? {
                pageButtons: controls.pageButtons,
                pageSizeSelector: controls.pageSizeSelector
            } : undefined
        };
    }

    return config;
}

/**
 * Merge extracted child configuration with user-provided options.
 * Child component props take precedence over options.
 * 
 * @param options - User-provided grid options
 * @param childConfig - Configuration extracted from children
 * @returns Merged options object
 */
export function mergeOptionsWithChildConfig<TOptions>(
    options: TOptions,
    childConfig: ExtractedChildConfig
): TOptions {
    if (!childConfig.pagination) {
        return options;
    }

    const merged: TOptions = {
        ...options,
        pagination: {
            ...childConfig.pagination
        }
    };

    return merged;
}
