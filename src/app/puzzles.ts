export enum Difficulty {
    BABY = 'baby',
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
}

export interface Puzzle {
    id: string;
    puzzleString: string;
    difficulty: Difficulty;
    description?: string;
}

export const puzzles: Puzzle[] = [
    {
        id: '4dab1358-45d6-47e2-9ad8-1b9e8a47268c',
        puzzleString: `
        #9#643##2
        2##7#9#1#
        ##7##29#6
        ##9378##4
        8319###65
        ####56##8
        57#23##89
        4#38#####
        ####6####`,
        difficulty: Difficulty.BABY,
        description: 'The easiest puzzle in the world.'
    },
    {
        id: 'a46d089f-db9d-4864-a147-00e265b4826a',
        puzzleString: `
        #512###9#
        #38#79#4#
        29#5####6
        1236##7##
        87#3#1#54
        ##9##8361
        4####2#15
        #1#86#43#
        #6###792#`,
        difficulty: Difficulty.EASY
    },
    {
        id: '5689e46e-ad2c-4694-b2bc-7384803f81d0',
        puzzleString: `
        38##5####
        #2##7#6#5
        ###6#2##4
        #6#3##29#
        153#####8
        ###7#####
        #9#26#8##
        ##8#####3
        2#1#####9`,
        difficulty: Difficulty.EASY
    },
    {
        id: '01c091e2-b3fc-4d70-84f6-ae142d2481d7',
        puzzleString: `
        ##4###291
        ##56##3##
        #8#231#6#
        ########9
        8####6#2#
        362##571#
        ##6######
        7##3#214#
        19#######`,
        difficulty: Difficulty.MEDIUM
    },
    {
        id: '60662b7d-26bd-47de-99ca-97ff3fa9f1f1',
        puzzleString: `
        ##5###1##
        #7#5#132#'
        #6####7##
        ###943###
        8##2####9
        924#7##1#
        #####4##5
        54#1#9###
        ##6##2#41`,
        difficulty: Difficulty.MEDIUM
    },
    {
        id: '1512351325-26bd-47de-99ca-97ff3fa9f1f1',
        puzzleString: `
        2##3##8##
        #####2###
        #4###9###
        ##8##136#
        17#######
        36#8#####
        #9#147#2#
        63##2##41
        ######9##
        `,
        difficulty: Difficulty.HARD
    },
    {
        id: '623782346-26bd-47de-99ca-97ff3fa9f1f1',
        puzzleString: `
        2####9###
        #9#5###6#
        815#7#9##
        1###67#9#
        9##45###2
        #3######8
        #5####82#
        4######16
        3##2####7
        `,
        difficulty: Difficulty.HARD
    },
]