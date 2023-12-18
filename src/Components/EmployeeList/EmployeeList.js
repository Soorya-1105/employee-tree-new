import React from 'react';
import './EmployeeList.css';

const EmployeeList = ({ teamArray, employees, onFilterChange, onTeamFilterChange }) => {
return (
    <div className="left-part-main-div">
        <div>
            <div className="left-part-employee-details-text">
                Employee Details
            </div>
            <div className="searchBar-drpDown">
                <input
                    className="search-box"
                    type="text"
                    placeholder="Search by Name, Designation, or Team"
                    onChange={(e) => onFilterChange(e.target.value)}
                />
                <select className="teams-dropDown" onChange={(e) => onTeamFilterChange(e.target.value)}>
                    <option value="">All Teams</option>
                    {teamArray.map((team) => (
                        team &&
                            <option key={team} value={team}>
                                {team}
                            </option>
                    ))}
                </select>
            </div>
        </div>
        <table className="employee-table">
            <thead className="employee-table-header">
                <tr>
                    <th>
                        Name
                    </th>
                    <th>
                        Designation
                    </th>
                    <th>
                        Team
                    </th>
                </tr>
            </thead>
            <tbody className="employee-table-tbody">
            {employees.map((employee, index) => (
                <tr key={index} className="zoom-row">
                    <td>{employee.name}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.team}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);
};

export default EmployeeList;
