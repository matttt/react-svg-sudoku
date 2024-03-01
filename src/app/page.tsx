"use client"
import { useState, useEffect } from "react";
import { useKeyPress } from 'ahooks';
import Div100vh from 'react-div-100vh';
import Switch, { SwitchProps } from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import { PuzzlePicker } from './puzzlePicker'

import { puzzles } from './puzzles'

import Confetti from 'react-confetti'
import {
  gridToString,
  flatCellArrTo2DArr,
  checkIfWin,
  toggleCandidate,
  doesRowContainValue,
  doesColContainValue,
  doesSquareContainValue,
  createSudokuGridFromPuzzleString
} from "./util";
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



export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [candidateMode, setCandidateMode] = useState(false)
  const [babyMode, setBabyMode] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(true)

  // used so ssr doesn't cry about window not being defined
  useEffect(() => {
    setIsClient(true)
  }, [])

  let gridSize = 500

  if (isClient) {
    gridSize = Math.min(window.innerWidth, window.innerHeight) * .8
  }

  if (!isMobile) {
    gridSize = Math.min(gridSize, 500)
  }
  const cellCize = gridSize / 9


  const blankSudoku = createSudokuGridFromPuzzleString(`#########\n`.repeat(9))


  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [sudoku, setSudoku] = useState<Cell[]>(blankSudoku);


  const onNewPuzzleStr = (puzzleStr: string) => {
    setPickerOpen(false)
    setSelectedCell(null)
    setSudoku(createSudokuGridFromPuzzleString(puzzleStr))
  }

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
      if (candidateMode) {
        setSudoku(sudoku.map((cell, n) => n === cellIdx ? { ...cell, candidates: {} } : cell))
      }

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

  const handleBabyModeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBabyMode(event.target.checked);
  }

  const handleHighlightChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHighlight(event.target.checked);
  }

  const sudokuGrid = <g>
    {sudoku.map((cell, n) => {
      const isSelected = selectedCell?.[0] === cell.i && selectedCell?.[1] === cell.j
      const isSameValueAsSelected = currentlySelectedVal && cell.value === currentlySelectedVal;
      const isPreset = cell.isPreset;

      // if the cell is selected, fill it with a different color
      // or if the cell has the same value as the selection fill it with a different color
      const fill = isSelected ? "#dbf4ff" : (isSameValueAsSelected && highlight) ? "#f0ebb1" : isPreset ? '#EEE' : "#FFF"

      const clickHandler = () => (selectedCell && cell.i === selectedCell[0] && cell.j === selectedCell[1]) ? setSelectedCell(null) : setSelectedCell([cell.i, cell.j])

      const isContradictedInRow = currentlySelectedVal && doesRowContainValue(sudoku, cell.j, currentlySelectedVal)
      const isContradictedInCol = currentlySelectedVal && doesColContainValue(sudoku, cell.i, currentlySelectedVal)
      const isContradictedInSquare = currentlySelectedVal && doesSquareContainValue(sudoku, cell.i, cell.j, currentlySelectedVal)

      //  ||  || 
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
            const x = cell.i * cellCize + (cellCize / 3 * j + cellCize / 6) * .75 + (cellCize * 0.125);
            const y = cell.j * cellCize + (cellCize / 3 * i + cellCize / 6) * .75 + (cellCize * 0.125) + 2;
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
              onClick={clickHandler}
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
        {babyMode && <>{(!cell.value && isContradictedInRow) && <line
          x1={cell.i * cellCize + cellCize / 2 - cellCize * 0.3}
          y1={cell.j * cellCize + cellCize / 2}
          x2={cell.i * cellCize + cellCize / 2 + cellCize * 0.3}
          y2={cell.j * cellCize + cellCize / 2}
          strokeDasharray={"1,1"}
          stroke="#f78bab"
          strokeWidth={1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={cellCize * 0.4}
          style={{ userSelect: "none", fontWeight: "bolder" }}
          onClick={clickHandler}
        />}
          {(!cell.value && isContradictedInCol) && <line
            x1={cell.i * cellCize + cellCize / 2}
            y1={cell.j * cellCize + cellCize / 2 - cellCize * 0.3}
            x2={cell.i * cellCize + cellCize / 2}
            y2={cell.j * cellCize + cellCize / 2 + cellCize * 0.3}
            strokeDasharray={"1,1"}
            stroke="#f78bab"
            strokeWidth={1}
            onClick={clickHandler}
          />}

          {(!cell.value && isContradictedInSquare) && <><line
            x1={cell.i * cellCize + cellCize / 2 - cellCize * 0.1}
            y1={cell.j * cellCize + cellCize / 2 - cellCize * 0.1}
            x2={cell.i * cellCize + cellCize / 2 + cellCize * 0.1}
            y2={cell.j * cellCize + cellCize / 2 + cellCize * 0.1}
            strokeDasharray={"1,1"}
            stroke="#f78bab"
            strokeWidth={1}

            onClick={clickHandler}
          /><line
              x1={cell.i * cellCize + cellCize / 2 + cellCize * 0.1}
              y1={cell.j * cellCize + cellCize / 2 - cellCize * 0.1}
              x2={cell.i * cellCize + cellCize / 2 - cellCize * 0.1}
              y2={cell.j * cellCize + cellCize / 2 + cellCize * 0.1}
              strokeDasharray={"1,1"}
              stroke="#f78bab"
              strokeWidth={1}

              fontSize={cellCize * 0.4}
              onClick={clickHandler}
            /></>}</>}

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

    <Div100vh className="overflow-hidden">
      <main className="flex min-h-screen flex-col items-center justify-between md:pt-8">
        {!isMobile && <div className="grow"></div>}
        {isMobile && <div className="h-8"></div>}
        {(isClient && checkIfWin(sudoku)) && <Confetti recycle={false} />}
        <PuzzlePicker open={pickerOpen} onClick={onNewPuzzleStr} setOpen={setPickerOpen} />
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
        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              control={<Switch onChange={handleHighlightChange} />}
              label="Highlight"
              labelPlacement="end"
            />
            <FormControlLabel
              control={<Switch onChange={handleBabyModeChange} />}
              label="Baby Mode"
              labelPlacement="end"
            />
          </FormGroup>
        </FormControl>
        <div className="h-8"></div>
        <div className="grow"></div>
      </main>
    </Div100vh>
  );
}
