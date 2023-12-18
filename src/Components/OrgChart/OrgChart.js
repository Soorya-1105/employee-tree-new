import React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import "./OrgChart.css";
import managerLogo from "../../Assets/manager.png";
import employeeLogo from "../../Assets/employee.png";
import ceoLogo from "../../Assets/ceo.png";

const OrgChartComponent = ({ treeData, setClickedEmpInfo, handleDrop, handleDragEnter }) => {

return (
<div style={{height: 'fit-content', marginTop: "80px", marginRight: "55px", borderRadius: "5px", background: "525252", color: "#dddddd", boxShadow: "#000000 0px 0px 8px" }}>
    {treeData && treeData.map((ceo) => (
        <div>
        <div className="emp-tree-manager-section" style={{borderBottom: `4px solid ${ceo.bgColor}`}}>
            <img src={ceoLogo} width= "5%" style={{marginRight: "5px"}}/>
            <div>
                <div className="emp-tree-emp-name">
                {ceo.name}
                </div>
                <div className="emp-tree-emp-designation">
                {ceo.attributes.designation}
                </div>
            </div>
        </div>
        <div style={{ display: 'flex'}}>
            {ceo && ceo.employees.map((managerData) => (
            <div key={managerData.managerId} style={{ marginLeft: '5px', marginRight: '5px' }}>
                <div className="emp-tree-manager-section" style={{borderBottom: `4px solid ${managerData.bgColor}`}}>
                    <img className="emp-tree-manager-logo" src={managerLogo} width= "25%"/>
                    <div>
                        <div className="emp-tree-emp-name">
                            {managerData.name}
                        </div>
                        <div className="emp-tree-emp-designation">
                            {managerData.attributes.designation}
                        </div>
                    </div>
                </div>
                <Container
                groupName='employees'
                onDrop={(dropResult) => handleDrop({dropResult, payload: managerData})}
                dragHandleSelector=".employee-main-div"
                onDragEnter={(dropResult) => handleDragEnter({dropResult, payload: managerData})}
                >
                {managerData.employees && managerData.employees.sort(function(a, b){
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                }).map((emp, i) => (
                    <Draggable key={emp.id} className="employee-drag-main-div" type="item" payload={{ id: emp.id, managerId: managerData.managerId }}>
                        <div style={{backgroundColor: `${emp.bgColor}`}} className="employee-main-div" onMouseDown = {() => setClickedEmpInfo(emp)}>
                            <img src={employeeLogo} width= "25%" style={{marginRight: "5px"}}/>
                            <div>
                                <div className="emp-tree-emp-name">
                                    {emp.name}
                                </div>
                                <div className="emp-tree-emp-designation">
                                    {emp.attributes.designation}
                                </div>
                            </div>
                        </div>
                    </Draggable>
                ))}
                </Container>
            </div>
            ))}
        </div>
        </div>
    ))}
    
    </div>
);
};

export default OrgChartComponent;
