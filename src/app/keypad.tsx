import {Button} from '@mui/material'
import Card from '@mui/material/Card';


function NumButton(props: { value: number|null, onPress: (value: number|null) => void}) {
    return (
        <Button variant="outlined" className="text-xl m-1" onClick={() => props.onPress(props.value)}>{props.value||'X'}</Button>
    )
}

export function Keypad(props: {handlePress: (value: number|null) => void}) {
    return (
        <div className="w-full flex">
            <div className="grow"></div>
            <Card className="p-2 border-2">
                <div>
                    <NumButton value={1} onPress={props.handlePress} />
                    <NumButton value={2} onPress={props.handlePress}/>
                    <NumButton value={3} onPress={props.handlePress}/>
                    <NumButton value={4} onPress={props.handlePress}/>
                    <NumButton value={5} onPress={props.handlePress}/>
                </div>
                <div>
                    <NumButton value={6} onPress={props.handlePress}/>
                    <NumButton value={7} onPress={props.handlePress}/>
                    <NumButton value={8} onPress={props.handlePress}/>
                    <NumButton value={9} onPress={props.handlePress}/>
                    <NumButton value={null} onPress={props.handlePress}/>
                </div>
                {/* <div>
                </div>
                <div className="flex w-full">
                    <div className="grow"></div>
                    <div className="grow"></div>
                </div> */}
            </Card>
            <div className="grow"></div>
        </div>
    )
}