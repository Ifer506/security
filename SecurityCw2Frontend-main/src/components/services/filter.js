import React from 'react';

const FilterSection = () => {
  return (
    <div className="filter-section">
      <button className="filter-button">Filter</button>
      <div className="filter-options">
        {/* Job Type */}
        <div className="filter-option">
          <h3>Job Type</h3>
          {/* Add your job type filter options here */}
        </div>

        {/* Position */}
        <div className="filter-option">
          <h3>Position</h3>
          {/* Add your position filter options here */}
          {/* Example dropdown menu */}
          <select>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Salary */}
        <div className="filter-option">
          <h3>Salary</h3>
          {/* Add your salary filter options here */}
        </div>

        {/* Location */}
        <div className="filter-option">
          <h3>Location</h3>
          {/* Add your location filter options here */}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
