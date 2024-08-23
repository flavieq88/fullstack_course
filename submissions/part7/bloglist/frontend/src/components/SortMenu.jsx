import { useDispatch, useSelector } from "react-redux";
import { filterChange } from "../reducers/filterReducer";

const SortMenu = () => {
  const filter = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const changeSelect = (event) => {
    dispatch(filterChange(event.target.value));
  };

  return (
    <div>
      Sort blogs by
      <select name="sort" id="sort" onChange={changeSelect} value={filter}>
        <option value="likes">likes</option>
        <option value="title">title</option>
        <option value="author">author</option>
      </select>
    </div>
  );
};

export default SortMenu;
