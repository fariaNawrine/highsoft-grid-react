
/**
 * Props for pagination controls
 */
export interface PaginationControlsProps {
    pageButtons?: boolean;
    pageSizeSelector?: boolean;
}

/**
 * Position of the pagination component relative to the table
 */
export type PaginationPosition = 'top' | 'bottom';

/**
 * Props for the Pagination component
 */
export interface PaginationProps {
    /**
     * Number of rows to display per page
     * @default 10
     */
    pageSize?: number;

    /**
     * Pagination controls configuration
     */
    controls?: PaginationControlsProps;

    /**
     * Position of pagination relative to the table
     * @default 'bottom'
     */
    position?: PaginationPosition;
}

/**
 * Pagination component for declarative pagination configuration.
 * 
 * @example
 * ```tsx
 * <GridPro options={options}>
 *   <Pagination pageSize={4} controls={{ pageButtons: true }} />
 *   <Table />
 * </GridPro>
 * ```
 */
export function Pagination(_props: PaginationProps): null {
    return null;
}

// Symbol to identify Pagination components during child processing
Pagination.displayName = 'Pagination';
Pagination.__isPaginationComponent = true;
