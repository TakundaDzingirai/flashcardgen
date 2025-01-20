// StudentIdInput.js
import React from "react";

const StudentIdInput = ({ studentId, onChange }) => {
    return (
        <input
            type="number"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => onChange(e.target.value)}
            className="student-input"
        />
    );
};

export default StudentIdInput;
