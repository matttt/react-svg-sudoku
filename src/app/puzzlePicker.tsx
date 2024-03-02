import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';

import { createSudokuGridFromPuzzleString } from './util';

import { puzzles } from './puzzles'

interface PuzzlePickerProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onClick: (puzzleString: string) => void
}
export function PuzzlePicker({ open, setOpen, onClick }: PuzzlePickerProps) {
    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    // @ts-ignore
    const BlurDrop = () => <Backdrop open={open} style={{'backdrop-filter':' blur(5px)'}}></Backdrop>

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            scroll='body'
            slots={{ backdrop: BlurDrop }}
        >
            <DialogTitle id="scroll-dialog-title">Pick a Sudoku Puzzle!</DialogTitle>
            <DialogContent>
                {/* use tailwind to create a 3 column css grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* map over the puzzles */}
                    {puzzles.map(puzzle => {
                        const grid = createSudokuGridFromPuzzleString(puzzle.puzzleString);

                        const previewSvg = (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                version="1.1"
                                width="150px"
                                height="150px"
                            // viewBox="0 0 100 100"
                            >
                                {grid.map((cell, i) => {
                                    const x = Math.floor(i / 9);
                                    const y = i % 9;
                                    const value = cell.value;
                                    // if (value) {
                                    return (
                                        <g key={i}>
                                            {/* <text
                                                key={i}
                                                x={`${x * 10 + 5}%`}
                                                y={`${y * 10 + 10}%`}
                                                dominantBaseline="middle"
                                                textAnchor="middle"
                                                fontSize="8"
                                                fill="white"
                                            >
                                                {value}
                                            </text> */}
                                            {value && <circle
                                                cx={`${x * 10 + 5}%`}
                                                cy={`${y * 10 + 5}%`}
                                                fill='#AAA'
                                                r={'2.5%'}
                                            ></circle>}
                                            <rect
                                                x={`${x * 10}%`}
                                                y={`${y * 10}%`}
                                                width="10%"
                                                height="10%"
                                                fill={'none'}
                                                stroke='#555'

                                            /></g>
                                    );
                                    // }
                                })}
                            </svg>
                        );

                        return (
                            <Button
                                key={puzzle.id}
                                onClick={() => onClick(puzzle.puzzleString)}
                            // style={{ width: '150px', height: '150px' }}
                            >
                                {previewSvg}
                            </Button>
                        )
                    })}
                </div>


            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClick(puzzles[Math.floor(Math.random() * puzzles.length)].puzzleString)}>Random</Button>
            </DialogActions>
        </Dialog>
    );
}
