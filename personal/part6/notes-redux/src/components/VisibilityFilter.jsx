import { filterChange } from '../reducers/filterReducer';
import { useDispatch } from 'react-redux';

const VisibilityFilter = () => {
  const dispatch = useDispatch();

  return (
    <div>
      all
      <input
        type='radio'
        name='filter'
        onChange={() => dispatch(filterChange('ALL'))}
      /> &nbsp;
      important
      <input
        type='radio'
        name='filter'
        onChange={() => dispatch(filterChange('IMPORTANT'))}
      /> &nbsp;
      nonimportant
      <input
        type='radio'
        name='filter'
        onChange={() => dispatch(filterChange('NONIMPORTANT'))}
      /> &nbsp;
    </div>
  );
};

export default VisibilityFilter;