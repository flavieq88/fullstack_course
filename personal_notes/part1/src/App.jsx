const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 13
  return (
    <>
      <h1>Greetings</h1>
      <Hello name='George' age={124+23552} />
      <Hello name='Daisy' age={234} />
      <Hello name={name} age={age} />
    </>
  )
}

export default App