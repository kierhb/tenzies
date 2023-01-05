import React from 'react'
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"


function App() {

    const [dice, setDice] = React.useState(allNewDice())

    const [tenzies, setTenzies] = React.useState(false)

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            console.log("You won!")
            setStartTimer(false)
        }
    }, [dice])
    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if (!tenzies) {
            setStartTimer(true)
            setRoll(prevRoll => prevRoll + 1)
            setDice(prevDice => prevDice.map(die => {
                return die.isHeld ?
                    die : generateNewDie()
            }))
        } else {
            setRoll(0)
            setTime(0)
            setTenzies(false)
            setDice(allNewDice())
            setLoggedTime(localStorage.getItem("Previous Time"))
        }
    }

    function holdDice(id) {
        setStartTimer(true)
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ?
                {...die, isHeld: !die.isHeld} : die
        }))
    }

    const diceElements = dice.map(die => (
        <Die 
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ))

    //* For Extra Credit
    const [roll, setRoll] = React.useState(0)

    const [time, setTime] = React.useState(0)
    const [startTimer, setStartTimer] = React.useState(false)
    const [timerLog, setTimerLog] = React.useState(0)

    React.useEffect(() => {
        let intervalLog = null
        if (startTimer) {
            intervalLog = setInterval(() => {
                setTime(prevTime => prevTime + 1)
            }, 1000)
            setTimerLog(intervalLog)
        } else {
            clearInterval(timerLog)
        }
        localStorage.setItem("Previous Time", JSON.stringify(time))
    }, [startTimer])

    const [loggedTime, setLoggedTime] = React.useState(0)

    return (
        <main className="App">
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="extra-credit">
                <p>Rolls: {roll}</p>
                <p>Time: {time} sec</p>
                <p>Previous Time: {loggedTime} sec</p>
            </div>
        </main>
    )
}

export default App
