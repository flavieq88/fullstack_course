const SortMenu = ({ onSelect }) => {
  const changeSelect = (event) => {
    onSelect(event.target.value)
  }
  return (
    <div>
      <div>
        Sort blogs by: 
        <select name='sort' id='sort' onChange={changeSelect}>
          <option value='likes'>likes</option>
          <option value='title'>title</option>
          <option value='author'>author</option>
        </select>
      </div>
    </div>
  );
};

export default SortMenu;
