import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Coins, Diamond, Scale, Crown, GraduationCap, Plane, Heart, Smartphone, Stethoscope } from 'lucide-react';
import './LoginSchemeComponent.css';

const iconMap = {
  'Coins': <Coins className="scheme-icon" />,
  'Diamond': <Diamond className="scheme-icon" />,
  'Scale': <Scale className="scheme-icon" />,
  'Crown': <Crown className="scheme-icon" />,
  'GraduationCap': <GraduationCap className="scheme-icon" />,
  'Plane': <Plane className="scheme-icon" />,
  'Heart': <Heart className="scheme-icon" />,
  'Smartphone': <Smartphone className="scheme-icon" />,
  'Stethoscope': <Stethoscope className="scheme-icon" />
};

const LoginSchemeComponent = () => {
  const { username } = useParams();
  const [schemes, setSchemes] = useState({
    registeredSchemes: [],
    availableSchemes: [],
    fullSchemes: []
  });
  const navigate = useNavigate();

  useEffect(() => {
  const fetchSchemes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/schemes/${username}`);
      const data = await response.json();

      // 1. Make a Set of registered scheme ids (normalized to string)
      const registeredIds = new Set(
        data.registeredSchemes.map(s =>
          s.scheme_id && typeof s.scheme_id === 'object'
            ? s.scheme_id._id?.toString?.() || s.scheme_id.toString()
            : s.scheme_id?.toString()
        )
      );

      // 2. Remove duplicate registered schemes
      const uniqueRegisteredSchemes = Array.from(
        new Map(
          data.registeredSchemes.map(s => {
            const id =
              s.scheme_id && typeof s.scheme_id === 'object'
                ? s.scheme_id._id?.toString?.() || s.scheme_id.toString()
                : s.scheme_id?.toString();
            return [id, s];
          })
        ).values()
      );

      // 3. Filter available schemes to NOT include any registered one
      const filteredAvailableSchemes = (data.availableSchemes || []).filter(
        s => !registeredIds.has(s._id && s._id.toString())
      );

      setSchemes({
        registeredSchemes: uniqueRegisteredSchemes,
        availableSchemes: filteredAvailableSchemes,
        fullSchemes: data.fullSchemes || []
      });
    } catch (error) {
      console.error('Error fetching schemes:', error);
    }
  };

  fetchSchemes();
}, [username]);


const handleMoreClick = (schemeIdObj) => {
  const schemeId = schemeIdObj?._id || schemeIdObj; // fallback to primitive
  navigate(`/loginmore/${schemeId}/${username}`, {
    state: {
      registeredSchemes: schemes.registeredSchemes
    }
  });
};

  
  // New function to handle auction history navigation  
  const handleViewHistoryClick = (id) => {
    navigate(`/auction`, { state: { schemeId: id, username } }); // Navigate to auction page
  };

  return (
    <div className="schemes-container">
      <h1>Welcome, {username}!</h1>
      <h2 style={{ color: 'white' }}>Registered Schemes</h2>
      <div className="schemes-grid">
        {schemes.registeredSchemes.map((scheme, index) => (
          <div key={index} className="scheme-card" style={{ backgroundColor: '#a9dfbf' }}>
            <div className="icon-container">
              {iconMap[scheme.icon] || null}
            </div>
            <h3 className="card-title">{scheme.name}</h3>
            <p className="card-description">{scheme.description}</p>
            <button className="register-button" onClick={() => handleMoreClick(scheme.scheme_id)}> 
              View Details
            </button>
            <button className="register-button" onClick={() => handleViewHistoryClick(scheme.scheme_id)}>
              View History
            </button>
          </div>
        ))}
      </div>
      <h2 style={{ color: 'white' }}>Available Schemes</h2>
      <div className="schemes-grid">
        {schemes.availableSchemes.map((scheme, index) => (
          <div key={index} className="scheme-card" style={{ backgroundColor: '#ffffff' }}>
            <div className="icon-container">
              {iconMap[scheme.icon] || null}
            </div>
            <h3 className="card-title">{scheme.name}</h3>
            <p className="card-description">{scheme.description}</p>
            <button className="register-button" onClick={() => handleMoreClick(scheme._id)}>
              More
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LoginSchemeComponent;
