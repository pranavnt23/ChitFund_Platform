import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './LoginMorePage.css';

const LoginMorePage = () => {
  const { id, username: routeUsername } = useParams();
  const location = useLocation();
  const registeredSchemes = location.state?.registeredSchemes || [];
  const navigate = useNavigate();

  const [schemeData, setSchemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegPrompt, setShowRegPrompt] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  const [registrationType, setRegistrationType] = useState(null); // "custom" or "random"
  const [registering, setRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Registration fields
  const [form, setForm] = useState({
    bankAcc: '',
    aadhar: '',
    ifsc: '',
    bankingName: '',
    username: routeUsername || '',
    password: '',
    subgroupId: '',
    slotId: ''
  });

  useEffect(() => {
    const fetchSchemeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/schemes/${id}`);
        const data = await response.json();
        setSchemeData(data);
      } catch (error) {
        console.error('Error fetching scheme details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemeDetails();
  }, [id]);

  const handleFormInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRegisterClick = () => {
    setShowRegPrompt(true);
    setShowRegForm(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRegistrationTypeSelect = (type) => {
    setRegistrationType(type);
    setShowRegPrompt(false);
    setShowRegForm(true);
    setForm(f => ({
      ...f,
      subgroupId: '',
      slotId: '',
    }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const closeForm = () => {
    setShowRegPrompt(false);
    setShowRegForm(false);
    setRegistrationType(null);
    setForm({
      bankAcc: '',
      aadhar: '',
      ifsc: '',
      bankingName: '',
      username: routeUsername || '',
      password: '',
      subgroupId: '',
      slotId: '',
    });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const validateForm = () => {
    const { bankAcc, aadhar, ifsc, bankingName, username, password, subgroupId, slotId } = form;
    if (
      !bankAcc.trim() ||
      !aadhar.trim() ||
      !ifsc.trim() ||
      !bankingName.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      setErrorMsg('Please fill all fields.');
      return false;
    }
    if (registrationType === "custom" && (!subgroupId.trim() || !slotId.trim())) {
      setErrorMsg('Please enter subgroup ID and slot ID.');
      return false;
    }
    return true;
  };

  // Handle the registration submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!validateForm()) return;
    setRegistering(true);

    try {
      // 1. Validate login credentials
      const loginResp = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      if (!loginResp.ok) {
        setErrorMsg('Username or password is incorrect for this account.');
        setRegistering(false);
        return;
      }

      // 2. Submit registration (with all details)
      const reqBody = {
        username: form.username,
        schemeId: id,
        bankAcc: form.bankAcc,
        aadhar: form.aadhar,
        ifsc: form.ifsc,
        bankingName: form.bankingName,
        registrationType
      };
      if (registrationType === 'custom') {
        reqBody.subgroupId = form.subgroupId;
        reqBody.slotId = form.slotId;
      }
      const regResp = await fetch('http://localhost:5000/api/schemes/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });

      if (regResp.ok) {
        setSuccessMsg('Registration successful!');
        setTimeout(() => {
          setShowRegForm(false);
          setShowRegPrompt(false);
          setRegistrationType(null);
          window.location.reload();
        }, 1200);
      } else {
        const data = await regResp.json();
        setErrorMsg(data?.message || "Registration failed.");
      }
    } catch (error) {
      setErrorMsg('Error registering for scheme.');
    }
    setRegistering(false);
  };

  const handleViewHistoryClick = () => {
    navigate('/auction', { state: { schemeId: id, username: routeUsername } });
  };

  if (loading) return <div>Loading...</div>;
  if (!schemeData) return <div>No scheme data available</div>;

  const isRegistered = registeredSchemes.some(scheme => scheme.scheme_id === id);

  return (
    <div className="table-container">
      <h1>{schemeData.name}</h1>
      <table className="scheme-table">
        <thead>
          <tr><th>Field</th><th>Details</th></tr>
        </thead>
        <tbody>
          <tr><td>Name</td><td>{schemeData.name}</td></tr>
          <tr><td>Description</td><td>{schemeData.description}</td></tr>
          <tr><td>Target Audience</td><td>{schemeData.target_audience}</td></tr>
          <tr><td>Monthly Contribution</td><td>₹{schemeData.investment_plan?.monthly_contribution}</td></tr>
          <tr><td>Chit Period</td><td>{schemeData.investment_plan?.chit_period} months</td></tr>
          <tr><td>Total Fund Value</td><td>₹{schemeData.investment_plan?.total_fund_value?.[0]?.value}</td></tr>
          <tr>
            <td>Benefits</td>
            <td>
              <ul>
                {schemeData.benefits?.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      {errorMsg && <div style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</div>}
      {successMsg && <div style={{ color: 'green', marginTop: '10px' }}>{successMsg}</div>}

      {!isRegistered ? (
        <div className="button-container">
          {!showRegPrompt && !showRegForm ? (
            <button className="register-button" onClick={handleRegisterClick}>
              Register for Scheme
            </button>
          ) : null}

          {/* Registration prompt for type selection */}
          {showRegPrompt && (
            <div className="register-dialog-overlay">
              <div className="register-dialog" style={{textAlign:"center"}}>
                <h2>Choose Registration Type</h2>
                <button
                  style={{ marginBottom: 12, width: "90%" }}
                  onClick={() => handleRegistrationTypeSelect("custom")}
                >
                  Custom Slot Registration
                </button>
                <button
                  style={{ width: "90%" }}
                  onClick={() => handleRegistrationTypeSelect("random")}
                >
                  Random Slot
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  style={{ background: "#b4bbc4", color:"#2a2a2a", marginTop:15, width: "50%"}}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Main Registration Form */}
          {showRegForm && (
            <div className="register-dialog-overlay">
              <div className="register-dialog">
                <h2>Register for {schemeData.name}</h2>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div>
                    <label>Bank Account No:</label>
                    <input
                      type="text"
                      name="bankAcc"
                      value={form.bankAcc}
                      onChange={handleFormInput}
                      placeholder="Enter your bank account number"
                    />
                  </div>
                  <div>
                    <label>Aadhar No:</label>
                    <input
                      type="text"
                      name="aadhar"
                      value={form.aadhar}
                      onChange={handleFormInput}
                      placeholder="Enter your Aadhar number"
                    />
                  </div>
                  <div>
                    <label>IFSC Code:</label>
                    <input
                      type="text"
                      name="ifsc"
                      value={form.ifsc}
                      onChange={handleFormInput}
                      placeholder="Enter your IFSC code"
                    />
                  </div>
                  <div>
                    <label>Banking Name:</label>
                    <input
                      type="text"
                      name="bankingName"
                      value={form.bankingName}
                      onChange={handleFormInput}
                      placeholder="Enter your banking name"
                    />
                  </div>
                  {registrationType === "custom" && (
                    <>
                      <div>
                        <label>Subgroup ID:</label>
                        <input
                          type="text"
                          name="subgroupId"
                          value={form.subgroupId}
                          onChange={handleFormInput}
                          placeholder="Enter Subgroup ID"
                        />
                      </div>
                      <div>
                        <label>Slot ID:</label>
                        <input
                          type="text"
                          name="slotId"
                          value={form.slotId}
                          onChange={handleFormInput}
                          placeholder="Enter Slot ID"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label>Username:</label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleFormInput}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div>
                    <label>Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleFormInput}
                      placeholder="Enter your password"
                    />
                  </div>
                  <div style={{marginTop: 10, display:"flex", justifyContent:"center"}}>
                    <button type="submit" disabled={registering}>
                      {registering ? 'Registering...' : 'Register'}
                    </button>
                    <button type="button" onClick={closeForm} disabled={registering} style={{marginLeft: 10}}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="button-container">
          <button className="view-history-button" onClick={handleViewHistoryClick}>
            View Auction History
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginMorePage;
