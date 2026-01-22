import { useState, useRef } from 'react';
import {
  type GridInstance,
  type GridOptions,
  type GridRefHandle,
  Grid,
  Pagination,
  Table,
} from '@highcharts/grid-pro-react';

function App() {
  const [options] = useState<GridOptions>({
    dataTable: {
      columns: {
        name: ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Kate', 'Liam'],
        age: [23, 34, 45, 56, 67, 28, 39, 41, 52, 33, 44, 55],
        city: ['New York', 'Oslo', 'Paris', 'Tokyo', 'London', 'Berlin', 'Madrid', 'Rome', 'Sydney', 'Toronto', 'Dubai', 'Singapore'],
        salary: [50000, 60000, 70000, 80000, 90000, 55000, 65000, 75000, 85000, 95000, 100000, 110000],
        active: [true, false, true, false, true, true, false, true, false, true, false, true]
      }
    },
    columnDefaults: {
      cells: {
        editMode: {
          enabled: true
        }
      }
    },
    caption: {
      text: 'Grid Pro - Component-Based Pagination'
    },
    columns: [{
      id: 'active',
      cells: {
        renderer: {
          type: 'checkbox'
        }
      }
    }]
  });
  const grid = useRef<GridRefHandle<GridOptions> | null>(null);

  const onButtonClick = () => {
    console.info('(ref) grid:', grid.current?.grid);
  };
  const onGridCallback = (grid: GridInstance<GridOptions>) => {
    console.info('(callback) grid:', grid);
  };

  return (
    <>
      {/* 
        Position options:
        - <Pagination> before <Table> → position: 'top'
        - <Pagination> after <Table> → position: 'bottom'
        - <Pagination> nested in <Table> → position: 'bottom'
        - Explicit position="top|bottom" prop always takes precedence
      */}
      <Grid options={options} gridRef={grid} callback={onGridCallback}>
        <Pagination 
          pageSize={4} 
          controls={{ pageButtons: true, pageSizeSelector: true }} 
        />
        <Table />
      </Grid>
      <button onClick={onButtonClick}>Click me</button>
    </>
  );
}

export default App;
