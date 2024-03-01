import { Cell } from './page'

export function gridToString(grid: Cell[]) {
    grid.sort((a: Cell, b: Cell) => a.j - b.j || a.i - b.i);
    
    const str = grid.map((cell: Cell) => {
        if (cell.i === 8) {
            return (cell.value||'#') + '\n'
        } else {
            return cell.value || '#'
        }
    }).join('');

    return str
}

export function flatCellArrTo2DArr(arr: Cell[]) {
    arr.sort((a: Cell, b: Cell) => a.j - b.j || a.i - b.i);

    let result = [];
    for (let i = 0; i < 9; i++) {
        result.push(arr.slice(i * 9, i * 9 + 9))
    }
    return result;
}

function checkIfArrayContainsEachDigitOnce(arr: (number|null)[]) {
    const set = new Set(arr);
    if (set.size !== 9) {
        return false;
    }
    for (let i = 1; i <= 9; i++) {
        if (!set.has(i)) {
            return false;
        }
    }
    return true;
}

export function checkIfWin(sudoku: Cell[]) {
    const grid = flatCellArrTo2DArr(sudoku);

    const rows = grid.map(row => row.map(cell => cell.value));
    const cols = grid[0].map((_, i) => grid.map(row => row[i].value));
    const squares = grid.map((row, i) => row.map((_, j) => grid[i - i % 3 + Math.floor(j / 3)][i * 3 % 9 + j % 3].value));

    return rows.every(checkIfArrayContainsEachDigitOnce) &&
        cols.every(checkIfArrayContainsEachDigitOnce) &&
        squares.every(checkIfArrayContainsEachDigitOnce);

    
}