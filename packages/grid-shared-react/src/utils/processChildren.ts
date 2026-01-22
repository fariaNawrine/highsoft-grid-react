import { ReactNode, Children, isValidElement, ReactElement } from 'react';
import { PaginationProps } from '../components/Pagination';
import { TableProps } from '../components/Table';

/**
 * Extracted configuration from child components
 */
export interface ExtractedChildConfig {
    pagination?: {
        enabled: boolean;
        pageSize?: number;
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

        config.pagination = {
            enabled: true,
            pageSize,
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
