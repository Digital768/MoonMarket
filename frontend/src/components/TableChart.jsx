import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

//sample data

const sampleData = [
    {
        "name": "Riot Blockchain, Inc.",
        "priceChange": -7.020000000000001,
        "priceChangePercentage": -40,
        "ticker": "RIOT",
        "value": 562.68
    },
    {
        "name": "Marathon Digital Holdings, Inc.",
        "priceChange": -2.7399999999999984,
        "priceChangePercentage": -12,
        "ticker": "MARA",
        "value": 1508.18
    },
    {
        "name": "Bit Digital, Inc.",
        "priceChange": -1.65,
        "priceChangePercentage": -37,
        "ticker": "BTBT",
        "value": 1281.28
    },
    {
        "name": "CleanSpark, Inc.",
        "priceChange": 5.090000000000002,
        "priceChangePercentage": 36,
        "ticker": "CLSK",
        "value": 3565.6200000000003
    },
    {
        "name": "Coinbase Global, Inc.",
        "priceChange": 58.129999999999995,
        "priceChangePercentage": 33,
        "ticker": "COIN",
        "value": 940.12
    },
    {
        "name": "Iris Energy Limited",
        "priceChange": 6.970000000000001,
        "priceChangePercentage": 101,
        "ticker": "IREN",
        "value": 1570.7
    },
    {
        "name": "TeraWulf Inc.",
        "priceChange": 2.28,
        "priceChangePercentage": 97,
        "ticker": "WULF",
        "value": 1060.27
    },
    {
        "name": "Cipher Mining Inc.",
        "priceChange": 1.4000000000000004,
        "priceChangePercentage": 36,
        "ticker": "CIFR",
        "value": 1310
    },
    {
        "name": "Core Scientific, Inc.",
        "priceChange": 4.29,
        "priceChangePercentage": 89,
        "ticker": "CORZ",
        "value": 190.89
    },
    {
        "name": "HIVE Blockchain Technologies Ltd.",
        "priceChange": -1.7799999999999998,
        "priceChangePercentage": -35,
        "ticker": "HIVE",
        "value": 309.12
    },
    {
        "name": "Bitfarms Ltd.",
        "priceChange": 0.9100000000000001,
        "priceChangePercentage": 41,
        "ticker": "BITF",
        "value": 698.88
    },
    {
        "name": "iShares Bitcoin Trust",
        "priceChange": 5.93,
        "priceChangePercentage": 19,
        "ticker": "IBIT",
        "value": 259.28
    }
]

const scrollbarStyles = {
    '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
    },
    // '&::-webkit-scrollbar-track': {
    //   backgroundColor: '#f1f1f1',
    // },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '3px',
        '&:hover': {
            backgroundColor: '#555',
        },
    },
};

// The columns definition remains the same
const columns = [
    {
        width: 250,
        label: 'Company',
        dataKey: 'name',
    },
    {
        width: 120,
        label: 'SharePrice',
        dataKey: 'sharePrice',
        numeric: true,
    },
    {
        width: 120,
        label: 'PriceChange',
        dataKey: 'priceChange',
        numeric: true,
    },
    {
        width: 120,
        label: 'PositionValue',
        dataKey: 'value',
        numeric: true,
    },
    {
        width: 120,
        label: 'Earnings',
        dataKey: 'earnings',
        numeric: true,
    },
];

// VirtuosoTableComponents remains the same
const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} sx={{
            ...scrollbarStyles,
        }} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    align={column.numeric || false ? 'right' : 'left'}
                    style={{ width: column.width }}
                    sx={{
                        backgroundColor: 'background.paper',
                        color: 'rgba(200, 200, 200, 0.5)',
                    }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

function rowContent(_index, row) {
    const formatPriceChange = (change, percentage) => {
        const isPositive = change >= 0;
        const color = isPositive ? 'green' : 'red';
        const sign = isPositive ? '+' : '';
        return (
            <span style={{ color }}>
                {`${sign}${change.toFixed(2)}(${sign}${percentage.toFixed(2)}%)`}
            </span>
        );
    };

    const formatValue = (value) => {
        return value.toFixed(2) + '$';
    };

    const formatEarnings = (dateString) => {
        if (!dateString) return 'N/A';  // or any placeholder you prefer
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        return `${month} ${day}`;
    };

    return (
        <React.Fragment>
            {columns.map((column, columnIndex) => (
                <TableCell
                    key={column.dataKey}
                    align={column.numeric || false ? 'right' : 'left'}
                    sx={columnIndex === 0 ? {
                        textShadow: '0px 0px 1px rgba(255, 255, 255, 0.5)',
                    } : {}}
                >
                    {column.dataKey === 'name' ? (
                        <div>
                            <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1em' }}>
                                {row.ticker}
                            </span>
                            {' '}
                            <span style={{ color: '#B0B0B0', fontSize: '0.9em' }}>
                                {row.name}
                            </span>
                        </div>
                    ) : column.dataKey === 'priceChange' ? (
                        formatPriceChange(row.priceChange, row.priceChangePercentage)
                    ) : column.dataKey === 'value' ? (
                        formatValue(row.value)
                    ) : column.dataKey === 'sharePrice' ? (
                        row[column.dataKey] + '$'
                    ) : column.dataKey === 'earnings' ? (
                        formatEarnings(row[column.dataKey])
                    ) : (
                        row[column.dataKey]
                    )}
                </TableCell>
            ))}
        </React.Fragment>
    );
}
// Modified to accept data as a prop
export default function ReactVirtualizedTable({ data }) {
    return (
        <Paper style={{ height: 600, width: 1100 }} sx={scrollbarStyles}>
            <TableVirtuoso
                data={data}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
            />
        </Paper>
    );
}