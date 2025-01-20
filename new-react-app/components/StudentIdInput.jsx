// StudentIdInput.js
import React from "react";

const StudentIdInput = ({ studentId, onChange }) => {
    return (
        <input
            type="number"
            placeholder="Please Enter Student ID"
            value={studentId}
            onChange={(e) => onChange(e.target.value)}
            style={{ marginBottom: "15px" }} // simple inline style
        />
    );
};

export default StudentIdInput;
