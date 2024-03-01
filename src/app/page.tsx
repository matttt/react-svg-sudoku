"use client"
import { useState, useEffect } from "react";
import { useKeyPress } from 'ahooks';
import Div100vh from 'react-div-100vh';

import Confetti from 'react-confetti'
import { gridToString, flatCellArrTo2DArr, checkIfWin } from "./util";
import { Keypad } from "./keypad";
import { isMobile } from 'react-device-detect';

import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface Candidates {
  [key: number]: boolean;
}

export interface Cell {
  i: number;
  j: number;
  value: number | null;
  isPreset: boolean;
  candidates: Candidates;
}

function toggleCandidate(cell: Cell, value: number): Cell {
  const candidates = { ...cell.candidates }
  candidates[value] = !candidates[value]
  return { ...cell, candidates }
}

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [candidateMode, setCandidateMode] = useState(false)

  // used so ssr doesn't cry about window not being defined
  useEffect(() => {
    setIsClient(true)
  }, [])

  let gridSize = 500

  if (isClient) {
    gridSize = Math.min(window.innerWidth, window.innerHeight) * 0.8
  }
  const cellCize = gridSize / 9

  //   const puzzleStr = `
  // 123678945
  // 584239761
  // 967#45328
  // 372461589
  // 691583274
  // 458792613
  // 836924157
  // 219857436
  // 745316892`
  const puzzleStr = `
  #512###9#
  #38#79#4#
  29#5####6
  1236##7##
  87#3#1#54
  ##9##8361
  4####2#15
  #1#86#43#
  #6###792#`

  //   const puzzleStr = `
  // 38##5####
  // #2##7#6#5
  // ###6#2##4
  // #6#3##29#
  // 153#####8
  // ###7#####
  // #9#26#8##
  // ##8#####3
  // 2#1#####9`

  const cleanedPuzzleStr = puzzleStr.trim().replace(/[^1-9#\n]/g, "")
  const puzzleGrid = cleanedPuzzleStr.split("\n").map(row => row.split(""))

  const startingSudoku: Cell[] = Array.from({ length: 9 * 9 }).map((_, n) => {
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

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [sudoku, setSudoku] = useState<Cell[]>(startingSudoku);

  const filterKey = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'uparrow', 'downarrow', 'leftarrow', 'rightarrow'];
  useKeyPress(filterKey, (event) => {
    if (selectedCell === null) return;

    const [i, j] = selectedCell;

    const cellIdx = j * 9 + i

    if (event.key === 'ArrowDown') {
      setSelectedCell([i, Math.min(j + 1, 8)])
      return;
    } else if (event.key === 'ArrowUp') {
      setSelectedCell([i, Math.max(j - 1, 0)])
      return;
    }
    else if (event.key === 'ArrowLeft') {
      setSelectedCell([Math.max(i - 1, 0), j])
      return;
    }
    else if (event.key === 'ArrowRight') {
      setSelectedCell([Math.min(i + 1, 8), j])
      return;
    }

    if (sudoku[cellIdx].isPreset) return;

    const value = parseInt(event.key)

    if (value === 0 || event.key === 'Backspace') {
      setSudoku(sudoku.map((cell, n) => n === cellIdx ? { ...cell, value: null } : cell))
      return;
    }

    if (value >= 1 && value <= 9) {
      if (candidateMode) {
        setSudoku(sudoku.map((cell, n) => n === cellIdx ? toggleCandidate(cell, value) : cell))
      } else {
        setSudoku(sudoku.map((cell, n) => n === cellIdx ? { ...cell, value } : cell))
      }
      return;
    }
  });

  let currentlySelectedVal: null | number = null;

  if (selectedCell !== null) {
    const [i, j] = selectedCell;
    const cellIdx = j * 9 + i;
    currentlySelectedVal = sudoku[cellIdx].value;
  }

  const handleNormalOrCandidateMode = (
    event: React.MouseEvent<HTMLElement>,
    newMode: boolean,
  ) => {
    setCandidateMode(newMode);
  }

  const sudokuGrid = <g>
    {sudoku.map((cell, n) => {
      const isSelected = selectedCell?.[0] === cell.i && selectedCell?.[1] === cell.j
      const isSameValueAsSelected = currentlySelectedVal && cell.value === currentlySelectedVal;
      const isPreset = cell.isPreset;

      // if the cell is selected, fill it with a different color
      // or if the cell has the same value as the selection fill it with a different color
      const fill = isSelected ? "#dbf4ff" : isSameValueAsSelected ? "#f0ebb1" : isPreset ? '#EEE' : "#FFF"

      const clickHandler = () => setSelectedCell([cell.i, cell.j])

      const mainText = <text
        x={cell.i * cellCize + cellCize / 2}
        y={cell.j * cellCize + cellCize / 2 + 3}
        width={cellCize}
        height={cellCize}
        fill="black"
        // stroke="#444"
        // strokeWidth={1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={cellCize * 0.5}
        style={{ userSelect: "none", fontWeight: cell.isPreset ? "bold" : "normal" }}
        onClick={clickHandler}
      >{cell.value}</text>

      const candidateText = <g>
        {Array.from({ length: 3 }).map((_, i) => {
          return Array.from({ length: 3 }).map((_, j) => {
            const value = i * 3 + j + 1;
            const x = cell.i * cellCize + (cellCize / 3 * j + cellCize / 6) * .9 + (cellCize * 0.05);
            const y = cell.j * cellCize + (cellCize / 3 * i + cellCize / 6) * .9 + (cellCize * 0.05) + 3;
            return <text
              key={value}
              x={x}
              y={y}
              width={cellCize}
              height={cellCize}
              fill="black"
              // stroke="#444"
              // strokeWidth={1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={cellCize * 0.2}
              style={{ userSelect: "none" }}
              onClick={() => onPress(value)}
            >{cell.candidates[value] ? value : ""}</text>
          })
        })}
      </g>

      return <g key={n}>
        <rect
          x={cell.i * cellCize}
          y={cell.j * cellCize}
          width={cellCize}
          height={cellCize}
          fill={fill}
          stroke="#444"
          strokeWidth={1}
          onClick={clickHandler}
        ></rect>
        {cell.value ? mainText : candidateText}
      </g>
    })}
  </g>

  // one line every 3 cells in horizontal and vert directions
  const sudokuLines = <g>
    {Array.from({ length: 10 }).map((_, i) => (
      <g key={i}>
        <line
          x1={i * cellCize}
          y1={0}
          x2={i * cellCize}
          y2={gridSize}
          stroke="#444"
          strokeWidth={i % 3 === 0 ? 3 : 1}
        />
        <line
          x1={0}
          y1={i * cellCize}
          x2={gridSize}
          y2={i * cellCize}
          stroke="#444"
          strokeWidth={i % 3 === 0 ? 3 : 1}
        />
      </g>
    ))}
  </g>

  const onPress = (value: number | null) => {
    if (selectedCell === null) return;

    const [i, j] = selectedCell;
    const cellIdx = j * 9 + i;

    if (sudoku[cellIdx].isPreset) return;

    if (value === null) {
      setSudoku(sudoku.map((cell, n) => n === cellIdx ? { ...cell, value: null } : cell))
      return;
    }

    if (typeof value === "number") {
      if (candidateMode) {
        setSudoku(sudoku.map((cell, n) => n === cellIdx ? toggleCandidate(cell, value) : cell))
        return;
      }
      setSudoku(sudoku.map((cell, n) => n === cellIdx ? { ...cell, value } : cell))

      return;
    }
  }

  return (
    <>
      <Div100vh className="overflow-hidden">
        <main className="flex min-h-screen flex-col items-center justify-between pt-8">
          <div className="grow"></div>
          {(isClient && checkIfWin(sudoku)) && <Confetti recycle={false} />}
          <h4 className="text-xl font-bold text-center mb-3">
            Sudoku!
          </h4>
          <svg width={gridSize} height={gridSize}>
            {sudokuGrid}
            {sudokuLines}
          </svg>
          <div className="grow"></div>
          {isClient && isMobile && <Keypad handlePress={onPress} />}
          <ToggleButtonGroup
            color="primary"
            value={candidateMode}
            exclusive
            onChange={handleNormalOrCandidateMode}
            aria-label="Normal or Candidate Mode"
            className="mt-3"
          >
            <ToggleButton value={false}>Normal</ToggleButton>
            <ToggleButton value={true}>Candidate</ToggleButton>
          </ToggleButtonGroup>
          <div className="grow"></div>
        </main>
      </Div100vh>
    </>
  );
}
