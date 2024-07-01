const Course = ({ course }) => {
    return (
    <div>
        <Header course={course} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
    )
}


const Header = ({ course }) => {
    return (
      <h2>{course.name}</h2>
    )
}
  

const Part = ({ part }) => 
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part => <Part key={part.id} part={part} />)}
        </div>
    )
}


const Total = ({ parts }) => {
    const total = parts.reduce((sum, currentPart) => sum + currentPart.exercises, 0) //0 is the initial value
    return (
    <p>
        <b>total of {total} exercises</b>
    </p>
    )
}

export default Course