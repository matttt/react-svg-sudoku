function Button(props: { value: number|null, onPress: (value: number|null) => void}) {
    return (
        <button className="rounded w-10 h-10 border truehover:bg-sky-100" onClick={() => props.onPress(props.value)}>{props.value||'X'}</button>
    )
}

export function Keypad(props: {handlePress: (value: number|null) => void}) {
    return (
        <div className="w-full flex">
            <div className="grow"></div>
            <div className="p-5 border-2">
                <div>
                    <Button value={1} onPress={props.handlePress} />
                    <Button value={2} onPress={props.handlePress}/>
                    <Button value={3} onPress={props.handlePress}/>
                </div>
                <div>
                    <Button value={4} onPress={props.handlePress}/>
                    <Button value={5} onPress={props.handlePress}/>
                    <Button value={6} onPress={props.handlePress}/>
                </div>
                <div>
                    <Button value={7} onPress={props.handlePress}/>
                    <Button value={8} onPress={props.handlePress}/>
                    <Button value={9} onPress={props.handlePress}/>
                </div>
                <div className="flex w-full">
                    <div className="grow"></div>
                    <Button value={null} onPress={props.handlePress}/>
                    <div className="grow"></div>
                </div>
            </div>
            <div className="grow"></div>
        </div>
    )
}