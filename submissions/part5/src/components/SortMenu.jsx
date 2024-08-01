const SortMenu = ({ onSelect }) => {
  const changeSelect = (event) => {
    onSelect(event.target.value);
  };
  return (
    <div>
      Sort blogs by:&nbsp;
      <select name='sort' id='sort' onChange={changeSelect}>
        <option value='likes'>likes</option>
        <option value='title'>title</option>
        <option value='author'>author</option>
      </select>
    </div>
  );
};

export default SortMenu;
