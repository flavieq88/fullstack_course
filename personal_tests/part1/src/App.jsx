import { useState } from 'react' // for the state


const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const Display = ({counter}) => { //destructuring props = {counter}
    return (
      <div>Counter is at {counter}</div>
    )
}

const Button = ({ onClick, text }) => {
  return (
    <button onClick = {onClick}>
      {text}
    </button>
  )
}

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )

  
}

const App = (props) => {
  const name = 'Peter'
  const age = 13

  //for the timer
  const {counter1} = props

  //for the state component
  const [ counter, setCounter ] = useState(0)

  const increaseOne = () => setCounter(counter + 1)
  
  const setZero = () => setCounter(0)

  //more state components
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat("L"))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat("R"))
    setRight(right + 1)
  }

  return (
    <>
      <h1>Greetings</h1>
      <Hello name='George' age={124+23552} />
      <Hello name='Daisy' age={234} />
      <Hello name={name} age={age} />
      <div>
        time spent on this webpage = {counter1} seconds
      </div>
      <br />
      <Display counter={counter} />
      <Button 
        onClick={increaseOne}
        text='plus'
      />
      <Button 
        onClick={setZero}
        text='zero'
      />
      <Button 
        onClick={() => setCounter(counter - 1)} //only one statement so we could just put here directly
        text='minus'
      />
  
      <div>
        <p>
          {left}
          <Button onClick={handleLeftClick} text="left" />
          <Button onClick={handleRightClick} text="right" />
          {right}
        </p>
        <History allClicks={allClicks} />
      </div>
      
      hello
      
    </>
  )
}



export default App