const Filter = ({ newShown, handleShownChange }) => {
  return (
    <div>filter shown with<input value={newShown} onChange={handleShownChange} /></div>
  )
}

export default Filter