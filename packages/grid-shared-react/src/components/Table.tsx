import { ReactNode } from 'react';

/**
 * Props for the Table component
 */
export interface TableProps {
    /**
     * Child components (e.g., Pagination) that should be
     * positioned relative to the table
     */
    children?: ReactNode;
}

/**
 * Table component for semantic positioning within Grid.
 * @example
 * ```tsx
 * // Pagination below the table
 * <GridPro options={options}>
 *   <Table />
 *   <Pagination pageSize={4} />
 * </GridPro>
 * 
 * // Pagination above the table
 * <GridPro options={options}>
 *   <Pagination pageSize={4} />
 *   <Table />
 * </GridPro>
 * ```
 */
export function Table(_props: TableProps): null {
    return null;
}

// Symbol to identify Table components during child processing
Table.displayName = 'Table';
Table.__isTableComponent = true;
