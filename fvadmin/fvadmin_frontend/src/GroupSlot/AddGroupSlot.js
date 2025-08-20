import React, { useState, useEffect } from "react";
import "./AddGroupSlot.css";

const AddGroupSlot = () => {
  const [step, setStep] = useState(1);
  const [subAdmin, setSubAdmin] = useState("");
  const [groupName, setGroupName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [numSubgroups, setNumSubgroups] = useState(1);
  const [subgroups, setSubgroups] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [status, setStatus] = useState(null);

  // Fetch schemes on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/schemes")
      .then((res) => res.json())
      .then((data) => setSchemes(data))
      .catch(() =>
        setStatus({ type: "error", message: "Error fetching schemes" })
      );
  }, []);

  // Initialize subgroups
  const handleSubgroupCount = (count) => {
    const newSubgroups = [];
    for (let i = 0; i < count; i++) {
      newSubgroups.push({
        name: "",
        schemeLimit: 1,
        selectedSchemes: [] // array of {id, slots}
      });
    }
    setSubgroups(newSubgroups);
  };

  // Update subgroup fields
  const handleSubgroupChange = (index, field, value) => {
    const updated = [...subgroups];
    updated[index][field] = value;
    setSubgroups(updated);
  };

  // Handle selecting/unselecting a scheme with prompt dialog for slots
  const handleSchemeSelect = (subIndex, scheme) => {
    const updated = [...subgroups];
    const subgroup = updated[subIndex];
    const existingIdx = subgroup.selectedSchemes.findIndex(
      (s) => s.id === scheme._id
    );

    if (existingIdx >= 0) {
      // Scheme already selected - remove it
      subgroup.selectedSchemes.splice(existingIdx, 1);
      setStatus(null);
    } else {
      if (subgroup.selectedSchemes.length < subgroup.schemeLimit) {
        // Prompt user for number of slots
        const input = window.prompt(
          `Enter number of slots for scheme "${scheme.name}":`,
          "1"
        );
        if (input === null) {
          // User canceled prompt
          return;
        }

        const slots = parseInt(input);
        if (isNaN(slots) || slots < 1) {
          alert("Please enter a valid positive integer for slots.");
          return;
        }

        subgroup.selectedSchemes.push({ id: scheme._id, slots });
        setStatus(null);
      } else {
        setStatus({
          type: "error",
          message: `You can only select ${subgroup.schemeLimit} scheme(s) for Subgroup ${
            subIndex + 1
          }.`
        });
      }
    }
    setSubgroups(updated);
  };

  // Validate Step 1
  const handleNext = async () => {
    if (!subAdmin || !groupName || !password || !confirmPassword) {
      setStatus({ type: "error", message: "All fields are required!" });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match!" });
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/subadmins/${subAdmin}`);
      if (!res.ok) {
        setStatus({ type: "error", message: "SubAdmin not found!" });
        return;
      }
      const data = await res.json();
      console.log("✅ SubAdmin exists:", data);

      handleSubgroupCount(numSubgroups);
      setStep(2);
      setStatus(null);
    } catch (err) {
      setStatus({ type: "error", message: "Error verifying SubAdmin!" });
    }
  };

  // Final submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subgroups.some((sg) => !sg.name)) {
      alert("❌ All subgroups must have a name!");
      return;
    }

    const requestBody = {
      subAdmin,
      groupName,
      password,
      numSubgroups,
      subgroups: subgroups.map((sg) => ({
        name: sg.name,
        no_of_schemes: sg.schemeLimit,
        schemes: sg.selectedSchemes.map((s) => ({
          schemeId: s.id,
          slots: s.slots
        }))
      }))
    };

    console.log("📤 Payload to backend:");
    console.log(JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch(
        "http://localhost:5000/api/groupslot/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("✅ GroupSlot submitted successfully!");
        console.log("✅ Backend Response:", data);
      } else {
        alert(`❌ Error: ${data.message || "Something went wrong!"}`);
        console.error("❌ Backend Error:", data);
      }
    } catch (err) {
      alert("🚨 Network error! Check if backend is running.");
      console.error("🚨 Network Error:", err);
    }
  };

  return (
    <div className="add-group-slot">
      <h2>Add GroupSlot</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <fieldset>
            <legend>Basic Details</legend>
            <input
              type="text"
              placeholder="SubAdmin Username"
              value={subAdmin}
              onChange={(e) => setSubAdmin(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Number of Subgroups"
              value={numSubgroups}
              min="1"
              onChange={(e) => setNumSubgroups(parseInt(e.target.value))}
              required
            />
            {status && (
              <div className={`status-box ${status.type}`}>
                {status.message}
              </div>
            )}
            <button type="button" className="submit-btn" onClick={handleNext}>
              Next →
            </button>
          </fieldset>
        )}

        {step === 2 && (
          <>
            {subgroups.map((sub, idx) => (
              <fieldset key={idx}>
                <legend>Subgroup {idx + 1}</legend>
                <input
                  type="text"
                  placeholder="Subgroup Name"
                  value={sub.name}
                  onChange={(e) =>
                    handleSubgroupChange(idx, "name", e.target.value)
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Number of Schemes"
                  value={sub.schemeLimit}
                  min="1"
                  onChange={(e) =>
                    handleSubgroupChange(
                      idx,
                      "schemeLimit",
                      parseInt(e.target.value)
                    )
                  }
                  required
                />
                <div className="scheme-list">
                  {schemes.map((scheme) => {
                    const selected = sub.selectedSchemes.find(
                      (s) => s.id === scheme._id
                    );
                    return (
                      <div key={scheme._id} className="scheme-item">
                        <span>{scheme.name}</span>
                        <button
                          type="button"
                          className={selected ? "selected" : ""}
                          onClick={() => handleSchemeSelect(idx, scheme)}
                        >
                          {selected ? "✓ Selected" : "Select"}
                        </button>

                        {/* Show slots read-only */}
                        {selected && (
                          <span style={{ marginLeft: 10 }}>
                            Slots: {selected.slots}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            {status && (
              <div className={`status-box ${status.type}`}>
                {status.message}
              </div>
            )}
            <button type="submit" className="submit-btn">
              Submit GroupSlot
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddGroupSlot;
