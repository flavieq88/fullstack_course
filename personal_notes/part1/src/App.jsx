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

const Button = (props) => {
  return (
    <button onClick = {props.onClick}>
      {props.text}
    </button>
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
    </>
  )
}



export default App