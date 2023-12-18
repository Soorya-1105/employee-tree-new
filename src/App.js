import React, { useState, useEffect, useRef } from 'react';
import EmployeeList from './Components/EmployeeList/EmployeeList';
import OrgChartComponent from "./Components/OrgChart/OrgChart";
import './App.css'

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [teamArray, setTeamArray] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filteredEmployeesPermanentForTeam, setFilteredEmployeesPermanentForTeam] = useState([]);
  const [filter, setFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [clickedEmpInfo, setClickedEmpInfo] = useState(null);
  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => {
        if(response.status === 200) {
          const mockEmployees = [
            { id: 1, name: 'Ragav', designation: 'CEO', bgColor: "#aaaaaa" },
            { id: 2, name: 'Siva', designation: 'Manager', team: 'Team A', manager: 2, managerId: 'manager1', bgColor: "#aaaaaa" },
            { id: 3, name: 'Hari', designation: 'Manager', team: 'Team B', manager: 3, managerId: 'manager2', bgColor: "#525252" },
            { id: 4, name: 'Vijay', designation: 'Manager', team: 'Team C', manager: 4, managerId: 'manager3', bgColor: "#aaaaaa" },
            { id: 5, name: 'Soorya', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 6, name: 'Janu', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 7, name: 'Ram', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 8, name: 'Anu', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 9, name: 'Soundarya', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 10, name: 'Riyaz', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 11, name: 'Raghu', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 12, name: 'Shri', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 13, name: 'Vivin', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 14, name: 'Victor', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 15, name: 'Rajesh', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 16, name: 'Krithika', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 17, name: 'Thaneirah', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 18, name: 'Akhil', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 19, name: 'Suresh', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 20, name: 'Santhosh', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 21, name: 'Mohamed', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 22, name: 'Amutha', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 23, name: 'Anish', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 24, name: 'Theju', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 25, name: 'Kishore', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 26, name: 'Viyaan', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 27, name: 'Vivek', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 28, name: 'Kaaviya', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 29, name: 'Vicky', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 30, name: 'Monish', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 31, name: 'Karthi', designation: 'Employee', team: 'Team C', manager: 4 },
            { id: 32, name: 'Pradeep', designation: 'Employee', team: 'Team A', manager: 2 },
            { id: 33, name: 'Trisha', designation: 'Employee', team: 'Team B', manager: 3 },
            { id: 34, name: 'Sankar', designation: 'Employee', team: 'Team C', manager: 4 },
          ];

          //Teams data for dropdown
          let tempTeamArray = [...new Set(mockEmployees.map((employee) => employee.team))];
          setTeamArray(tempTeamArray);

          //Setting overall datas
          setEmployees(mockEmployees);

          //Setting overall datas which not going to be changed
          setFilteredEmployeesPermanentForTeam(mockEmployees)

          //Filtered employees -- > initially setting all datas
          setFilteredEmployees(mockEmployees);

          //Building tree data for chart
          buildTreeData(mockEmployees);
        }
      })
  }, []);

  const handleFilterChange = (value) => {
    setFilter(value);
    filterEmployees(value, teamFilter);
  };

  const handleTeamFilterChange = (value) => {
    setTeamFilter(value);
    filterEmployees(filter, value, "teamFilter");
  };

  const filterEmployees = (text, team, teamFilter) => {
    //filtering acoording to the text from text box (name, designation and team)
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(text.toLowerCase()) ||
        employee.designation.toLowerCase().includes(text.toLowerCase()) ||
        employee.team?.toLowerCase().includes(text.toLowerCase())
    );

    //If team is selected filtering only those team members
    const teamFiltered = team ? filtered.filter((employee) => (employee.team === team)) : filtered;
    setFilteredEmployees(teamFiltered);

    //If team is changed from dropdown sending the overall data instead of filtered data for chart
    if(teamFilter) {
      buildTreeData(team ? (filteredEmployeesPermanentForTeam.filter((employee) => (employee.team === team  || employee.designation === "CEO"))) : filteredEmployeesPermanentForTeam);
    }
  };

  const buildTreeData = (employeeList) => {
    //Creating the Tree data for chart
    /*structure = {
      ceoName: ...,
      designation: ...,
      employeesUnderHim: [
          {managerName: ...,
          designation: ...,
          employeesUnderEachManager: [
            {
              employeeName: ...,
              designation: ...
            }
          ]
          }
        ]
    }*/
    const ceo = employeeList.filter((employee) => employee.designation === 'CEO');
    const managers = employeeList.filter((employee) => employee.designation === 'Manager');
    const treeData = ceo.map((ceoInfo) => ({
      name: ceoInfo.name,
      attributes: {designation: ceoInfo.designation},
      employees: managers.map((manager) => ({
        name: manager.name,
        attributes: { designation: manager.designation, team: manager.team },
        employees: getEmployeeDetails(manager.id, employeeList, manager.managerId, manager.bgColor),
        managerId: manager.managerId,
        manager: manager.manager,
        bgColor: manager.bgColor,
      })),
      bgColor: ceoInfo.bgColor
    }))
    setTreeData(treeData);
  };

  const getEmployeeDetails = (managerId, employeeList, managerIdNo, bgColor) => {
    //Creating employee details as an array for each manager
    const subordinates = employeeList
      .filter((employee) => employee.manager === managerId && employee.designation === "Employee")
      .map((employee) => ({
        name: employee.name,
        attributes: { designation: employee.designation, team: employee.team, managerId: managerIdNo },
        id:employee.id,
        bgColor: bgColor, 
        employees: getEmployeeDetails(employee.id, employeeList),
      }));

    return subordinates.length ? subordinates : null;
  };

  const handleDrop = (drop) => {
    //Setting the Data after the dragged employeeis dropped
    let draggedItem = tempData

    //Checking whether the dragged employee is dropped on the same manager
    if(clickedEmpInfo.attributes.managerId !== draggedItem.payload.managerId) {
      if(draggedItem && draggedItem.payload && draggedItem.payload.name) {
        let tempTreeMainData = [...treeData]
        let tempTreeData =  [...tempTreeMainData[0].employees]
        //Index of new manager where the employee needs to be pushed
        let indexOfNew = tempTreeData.findIndex((mng) => mng.managerId === draggedItem.payload.managerId);
        //Index of old manager from where employee needs to be pushed
        let indexOfOld = tempTreeData.findIndex((mng) => mng.managerId === clickedEmpInfo.attributes.managerId);
        //Index of employee in overAll permamnent List Array
        let indexOfList = filteredEmployeesPermanentForTeam.findIndex((mng) => mng.id === clickedEmpInfo.id);
        //Index of employee in overAll List Array
        let indexOfListOfFiltered = filteredEmployees.findIndex((mng) => mng.id === clickedEmpInfo.id);

        clickedEmpInfo.attributes.managerId = draggedItem.payload.managerId
        clickedEmpInfo.attributes.team = draggedItem.payload.attributes.team
        clickedEmpInfo.bgColor = draggedItem.payload.bgColor

        //Changing the dragged employee's info in the overall data
        let tempFilteredEmployees = [...filteredEmployeesPermanentForTeam]
        tempFilteredEmployees[indexOfList].managerId = draggedItem.payload.managerId
        tempFilteredEmployees[indexOfList].team = draggedItem.payload.attributes.team
        tempFilteredEmployees[indexOfList].manager = draggedItem.payload.manager
        setEmployees(tempFilteredEmployees)

        //Changing the dragged employee's info in the filtered data
        let tempFilteredEmployeesOfFiltered = [...filteredEmployees]
        tempFilteredEmployeesOfFiltered[indexOfListOfFiltered].managerId = draggedItem.payload.managerId
        tempFilteredEmployeesOfFiltered[indexOfListOfFiltered].team = draggedItem.payload.attributes.team
        tempFilteredEmployeesOfFiltered[indexOfListOfFiltered].manager = draggedItem.payload.manager
        setFilteredEmployees(tempFilteredEmployeesOfFiltered)

        //Pushing the dragged employee data under dropped manager
        tempTreeData[indexOfNew].employees.push(clickedEmpInfo)

        //Removing the dragged employee data from the old manager
        let indexOfOldChildren = tempTreeData[indexOfOld].employees.findIndex((mng) => mng.id === clickedEmpInfo.id)
        tempTreeData[indexOfOld].employees.splice(indexOfOldChildren,1)
        setTreeData(tempTreeMainData)
      }
    }
  };

  const handleDragEnter = (draggedItem) => {
    //Saving the Manager detail while entering its column
    setTempData(draggedItem)
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: "100%", background: "#353535" }}>
      <EmployeeList
        teamArray={teamArray}
        employees={filteredEmployees}
        onFilterChange={handleFilterChange}
        onTeamFilterChange={handleTeamFilterChange}
      />
      <OrgChartComponent 
        treeData = {treeData}
        setClickedEmpInfo = {setClickedEmpInfo}
        handleDrop = {handleDrop}
        handleDragEnter = {handleDragEnter}
      />
    </div>
  );
};

export default App;