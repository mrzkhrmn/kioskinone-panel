import React, { useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import {
  useGetParameterHospitalsQuery,
  useGetParameterDepartmentsQuery,
  useGetKiosksQuery,
} from "../store/api/kioskParameterApi";

const HospitalNode = ({
  hospital,
  selectedScope,
  onScopeSelect,
  expandedNodes,
  setExpandedNodes,
}) => {
  const isDepartmentExpanded = expandedNodes.departments[hospital.id];
  const { data: departments } = useGetParameterDepartmentsQuery(
    { hospitalId: hospital.id },
    {
      skip: !isDepartmentExpanded,
    }
  );

  const handleHospitalToggle = () => {
    setExpandedNodes((prev) => ({
      ...prev,
      departments: {
        ...prev.departments,
        [hospital.id]: !prev.departments[hospital.id],
      },
    }));
  };

  const handleHospitalSelect = () => {
    onScopeSelect({
      level: "hospital",
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      departmentId: null,
      kioskId: null,
    });
  };

  const isSelected =
    (selectedScope.level === "hospital" &&
      selectedScope.hospitalId === hospital.id) ||
    (selectedScope.hospitalId === hospital.id &&
      (selectedScope.level === "department" ||
        selectedScope.level === "kiosk"));

  return (
    <div>
      <div className="flex items-center">
        <div
          onClick={handleHospitalToggle}
          className="p-1 cursor-pointer hover:bg-gray-100 rounded"
        >
          {isDepartmentExpanded ? (
            <FiChevronDown className="text-sm" />
          ) : (
            <FiChevronRight className="text-sm" />
          )}
        </div>
        <div
          onClick={handleHospitalSelect}
          className={`flex-1 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            isSelected && selectedScope.level === "hospital"
              ? "bg-primary text-white"
              : isSelected && selectedScope.level !== "hospital"
              ? "bg-primary/20 text-primary"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <span>{hospital.name}</span>
        </div>
      </div>

      {isDepartmentExpanded && departments?.data && (
        <div className="ml-8 mt-1 space-y-1">
          {departments.data.map((department) => (
            <DepartmentNode
              key={department.id}
              hospital={hospital}
              department={department}
              selectedScope={selectedScope}
              onScopeSelect={onScopeSelect}
              expandedNodes={expandedNodes}
              setExpandedNodes={setExpandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentNode = ({
  hospital,
  department,
  selectedScope,
  onScopeSelect,
  expandedNodes,
  setExpandedNodes,
}) => {
  const key = `${hospital.id}-${department.id}`;
  const isKioskExpanded = expandedNodes.kiosks[key];
  const { data: kiosks } = useGetKiosksQuery(
    {
      hospitalId: hospital.id,
      departmentId: department.id,
    },
    {
      skip: !isKioskExpanded,
    }
  );

  const handleDepartmentToggle = () => {
    setExpandedNodes((prev) => ({
      ...prev,
      kiosks: {
        ...prev.kiosks,
        [key]: !prev.kiosks[key],
      },
    }));
  };

  const handleDepartmentSelect = () => {
    onScopeSelect({
      level: "department",
      hospitalId: hospital.id,
      departmentId: department.id,
      departmentName: department.name,
      kioskId: null,
    });
  };

  const isSelected =
    (selectedScope.level === "department" &&
      selectedScope.hospitalId === hospital.id &&
      selectedScope.departmentId === department.id) ||
    (selectedScope.hospitalId === hospital.id &&
      selectedScope.departmentId === department.id &&
      selectedScope.level === "kiosk");

  return (
    <div>
      <div className="flex items-center">
        <div
          onClick={handleDepartmentToggle}
          className="p-1 cursor-pointer hover:bg-gray-100 rounded"
        >
          {isKioskExpanded ? (
            <FiChevronDown className="text-sm" />
          ) : (
            <FiChevronRight className="text-sm" />
          )}
        </div>
        <div
          onClick={handleDepartmentSelect}
          className={`flex-1 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            isSelected && selectedScope.level === "department"
              ? "bg-primary text-white"
              : isSelected && selectedScope.level !== "department"
              ? "bg-primary/20 text-primary"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <span>{department.name}</span>
        </div>
      </div>

      {isKioskExpanded && kiosks?.data && (
        <div className="ml-8 mt-1 space-y-1">
          {kiosks.data.map((kiosk) => {
            const handleKioskSelect = () => {
              onScopeSelect({
                level: "kiosk",
                hospitalId: hospital.id,
                departmentId: department.id,
                kioskId: kiosk.id,
                kioskName: kiosk.name,
              });
            };

            const isKioskSelected =
              selectedScope.level === "kiosk" &&
              selectedScope.hospitalId === hospital.id &&
              selectedScope.departmentId === department.id &&
              selectedScope.kioskId === kiosk.id;

            return (
              <div
                key={kiosk.id}
                onClick={handleKioskSelect}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isKioskSelected
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span>{kiosk.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ScopeTree = ({ onScopeSelect }) => {
  const [selectedScope, setSelectedScope] = useState({
    level: "global",
    hospitalId: null,
    departmentId: null,
    kioskId: null,
  });
  const [expandedNodes, setExpandedNodes] = useState({
    hospitals: false,
    departments: {},
    kiosks: {},
  });

  const { data: hospitals } = useGetParameterHospitalsQuery(undefined, {
    skip: !expandedNodes.hospitals,
  });

  const handleGlobalClick = () => {
    const scope = {
      level: "global",
      hospitalId: null,
      departmentId: null,
      kioskId: null,
    };
    setSelectedScope(scope);
    onScopeSelect(scope);
  };

  const handleScopeSelect = (scope) => {
    setSelectedScope(scope);
    onScopeSelect(scope);
  };

  const isGlobalSelected = selectedScope.level === "global";
  const isGlobalInPath = selectedScope.level !== "global";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Scope Seçimi</h3>
      <div className="space-y-1">
        <div
          onClick={handleGlobalClick}
          className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            isGlobalSelected
              ? "bg-primary text-white"
              : isGlobalInPath
              ? "bg-primary/20 text-primary"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <span className="font-medium">Global</span>
        </div>

        <div>
          <div
            onClick={() =>
              setExpandedNodes((prev) => ({
                ...prev,
                hospitals: !prev.hospitals,
              }))
            }
            className="flex items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 text-gray-700 transition-colors"
          >
            {expandedNodes.hospitals ? (
              <FiChevronDown className="mr-2" />
            ) : (
              <FiChevronRight className="mr-2" />
            )}
            <span className="font-medium">Hastaneler</span>
          </div>

          {expandedNodes.hospitals && hospitals?.data && (
            <div className="ml-6 mt-1 space-y-1">
              {hospitals.data.map((hospital) => (
                <HospitalNode
                  key={hospital.id}
                  hospital={hospital}
                  selectedScope={selectedScope}
                  onScopeSelect={handleScopeSelect}
                  expandedNodes={expandedNodes}
                  setExpandedNodes={setExpandedNodes}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScopeTree;
