const Header = (props) => <h2>{props.course}</h2>

const Content = ({ parts }) => (
  <div>
    {parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)}
  </div>
)

const Total = ({ parts }) => {
  console.log(parts)
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  console.log(total)

  return (
    <b>Total of {total} exercises</b>
  )
}

const Course = ({ course }) => {
  return (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
  )
}

const Courses = ({ courses }) => {
  return (
    <div>
      {courses.map(course => <Course key={course.id} course={course} parts={course.parts}/>)}
    </div>
  )
}

export default Courses