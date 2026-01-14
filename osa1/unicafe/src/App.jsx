import { useState } from 'react'

const Statistics = (props) => {
  console.log(props)
  if (props.kaikki[3].value === 0)
    return (
      <div>
        No feedback given
      </div>
    )

  return (
    <div>
      <table>
        <tbody>
        <StatisticsLine text={props.kaikki[0].text} value={props.kaikki[0].value} />
        <StatisticsLine text={props.kaikki[1].text} value={props.kaikki[1].value} />
        <StatisticsLine text={props.kaikki[2].text} value={props.kaikki[2].value} />
        <StatisticsLine text={props.kaikki[3].text} value={props.kaikki[3].value} />
        <StatisticsLine text={'average'} value={props.kaikki[4].value / props.kaikki[3].value} />
        <StatisticsLine text={'positive'} value={props.kaikki[0].value / props.kaikki[3].value * 100} pros='%' />
        </tbody>
      </table>
    </div>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
      <td>{props.pros}</td>
    </tr>
  )
}

const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [allSum, setAllSum] = useState(0)

  const kaikki = [
    {
      text: 'good', value: good,
    },
    {
      text: 'neutral', value: neutral,
    },
    {
      text: 'bad', value: bad,
    },
    {
      text: 'all', value: all,
    },
    {
      text: 'allSum', value: allSum,
    }
    ]

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    console.log('lisätty hyvä')
    setAll(updatedGood + neutral + bad)
    const updatedAllSum = allSum + 1
    setAllSum(updatedAllSum)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    console.log('lisätty neutraali')
    setAll(good + updatedNeutral + bad)
    const updatedAllSum = allSum + 0
    setAllSum(updatedAllSum)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    console.log('lisätty huono')
    setAll(good + neutral + updatedBad)
    const updatedAllSum = allSum - 1
    setAllSum(updatedAllSum)
  }


  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text='Good' />
      <Button onClick={handleNeutralClick} text='Neutral' />
      <Button onClick={handleBadClick} text='Bad' />
      <h1>statistics</h1>
      <Statistics kaikki={kaikki} />
    </div>
  )
}

export default App