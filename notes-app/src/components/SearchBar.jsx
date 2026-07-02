import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar">
      <FiSearch className="searchbar__icon" />
      <input
        type="text"
        placeholder="Search your notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="searchbar__input"
      />
      {value && (
        <button className="searchbar__clear" onClick={() => onChange('')} aria-label="Clear search">
          <FiX />
        </button>
      )}
    </div>
  );
}
