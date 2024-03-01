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

export function toggleCandidate(cell: Cell, value: number) {
    if (cell.isPreset) return cell;

    const candidates = { ...cell.candidates };

    if (candidates[value]) {
        delete candidates[value];
    } else {
        candidates[value] = true;
    }

    return { ...cell, candidates };
}

export function doesRowContainValue(sudoku: Cell[], row: number, value: number|null) {
    return sudoku.slice(row * 9, row * 9 + 9).some(cell => cell.value === value);
}

export function doesColContainValue(sudoku: Cell[], col: number, value: number|null) {
    return sudoku.filter((_, i) => i % 9 === col).some(cell => cell.value === value);
}

export function doesSquareContainValue(sudoku: Cell[], row: number, col: number, value: number|null) {
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;

    for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
            if (sudoku[j * 9 + i].value === value) {
                return true;
            }
        }
    }
    return false;
}


export function createSudokuGridFromPuzzleString(puzzleStr: string): Cell[] {
    const cleanedPuzzleStr = puzzleStr.trim().replace(/[^1-9#\n]/g, "")
    const puzzleGrid = cleanedPuzzleStr.split("\n").map(row => row.split(""))
  
    const sudoku: Cell[] = Array.from({ length: 9 * 9 }).map((_, n) => {
      const i = Math.floor(n / 9)
      const j = n % 9
  
      const value = puzzleGrid[j][i]
  
      return {
        i,
        j,
        value: value === "#" ? null : parseInt(value),
        isPreset: value !== "#",
        candidates: {}
      }
    }
    );
  
    return sudoku;
  }