const Filter = ({ newShown, handleShownChange }) => {
  return (
    <div>find countries <input value={newShown} onChange={handleShownChange} /></div>
  )
}

export default Filter