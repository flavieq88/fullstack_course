import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Statistics = ( {good, neutral, bad} ) => {
  const total = good+bad+neutral
  if (total === 0) {
    return (
      <div>
        No feedback given yet
      </div>
    )
  }
  return (
    <div>
      <h2>statistics</h2>
      
      <div>
        <StatisticLine label='good' value={good} />
        <StatisticLine label='neutral' value={neutral} />
        <StatisticLine label='bad' value={bad} />
        <StatisticLine label='all' value={total} />
        <StatisticLine label='average' value={(good-bad)/total} />
        <StatisticLine label='positive' value={`${100*good/total}%`} />
      </div>
    </div>
  )
}

const StatisticLine = ({ label, value }) => {
  return (
    <div>
      {label}:{value}
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>
        give feedback!
      </h1>
      
      <div>
        <Button handleClick={ () => {setGood(good+1)} } text='good' />
        <Button handleClick={ () => {setNeutral(neutral+1)} } text='neutral' />
        <Button handleClick={ () => {setBad(bad+1)} } text='bad' />
      </div>

      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App
