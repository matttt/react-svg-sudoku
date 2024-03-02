import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';

import { createSudokuGridFromPuzzleString } from './util';

import { puzzles, Difficulty } from './puzzles'

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
    
    const pickRandomOfDifficulty = (difficulty: Difficulty) => {
        const puzzlesOfDifficulty = puzzles.filter(puzzle => puzzle.difficulty === difficulty);
        return puzzlesOfDifficulty[Math.floor(Math.random() * puzzlesOfDifficulty.length)].puzzleString;
    }

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
                <div className="grid grid-cols-2 gap-4">
                    {Object.keys(Difficulty).map(d => <Button
                                key={d}
                                //@ts-ignore
                                onClick={() => onClick(pickRandomOfDifficulty(Difficulty[d] as Difficulty))}
                            // style={{ width: '150px', height: '150px' }}
                            >
                                {d}
                            </Button>)}
                </div>


            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClick(puzzles[Math.floor(Math.random() * puzzles.length)].puzzleString)}>Random</Button>
            </DialogActions>
        </Dialog>
    );
}
