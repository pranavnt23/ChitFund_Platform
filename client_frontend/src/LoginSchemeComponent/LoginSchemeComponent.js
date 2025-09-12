import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Coins, Diamond, Scale, Crown, GraduationCap, Plane, Heart, Smartphone, Stethoscope } from 'lucide-react';
import './LoginSchemeComponent.css';

const iconMap = {
  Coins: <Coins className="scheme-icon" />,
  Diamond: <Diamond className="scheme-icon" />,
  Scale: <Scale className="scheme-icon" />,
  Crown: <Crown className="scheme-icon" />,
  GraduationCap: <GraduationCap className="scheme-icon" />,
  Plane: <Plane className="scheme-icon" />,
  Heart: <Heart className="scheme-icon" />,
  Smartphone: <Smartphone className="scheme-icon" />,
  Stethoscope: <Stethoscope className="scheme-icon" />,
};

const LoginSchemeComponent = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState({
    registeredSchemes: [],
    availableSchemes: [],
    fullSchemes: [],
  });
  const [liveAuctions, setLiveAuctions] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/schemes/${username}`);
        const data = await response.json();
        const registeredIds = new Set(
          data.registeredSchemes.map((s) =>
            s.scheme_id && typeof s.scheme_id === 'object'
              ? s.scheme_id._id?.toString?.() || s.scheme_id.toString()
              : s.scheme_id?.toString()
          )
        );
        const uniqueRegisteredSchemes = Array.from(
          new Map(
            data.registeredSchemes.map((s) => {
              const id =
                s.scheme_id && typeof s.scheme_id === 'object'
                  ? s.scheme_id._id?.toString?.() || s.scheme_id.toString()
                  : s.scheme_id?.toString();
              return [id, s];
            })
          ).values()
        );
        const filteredAvailableSchemes = (data.availableSchemes || []).filter(
          (s) => !registeredIds.has(s._id.toString())
        );
        setSchemes({
          registeredSchemes: uniqueRegisteredSchemes,
          availableSchemes: filteredAvailableSchemes,
          fullSchemes: data.fullSchemes || [],
        });
      } catch (error) {
        console.error('Error fetching schemes:', error);
      }
    };

    const fetchLiveAuctions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auction/getauction/${username}`);
        const data = await response.json();
        setLiveAuctions(data.liveAuctions || []);
      } catch (error) {
        console.error('Error fetching live auctions:', error);
        setLiveAuctions([]);
      }
    };

    fetchSchemes();
    fetchLiveAuctions();
  }, [username]);

  // Extracts schemeId string from object or string
  const getSchemeId = (schemeIdObj) => {
    if (!schemeIdObj) return null;
    if (typeof schemeIdObj === 'object') {
      return schemeIdObj._id?.toString?.() || schemeIdObj.toString();
    }
    return schemeIdObj.toString();
  };

  const handleMoreClick = (schemeIdObj) => {
    const schemeId = getSchemeId(schemeIdObj);
    navigate(`/loginmore/${schemeId}/${username}`, {
      state: {
        registeredSchemes: schemes.registeredSchemes,
      },
    });
  };

  const handleParticipateClick = (schemeId) => {
    const id = getSchemeId(schemeId);
    navigate(`/participate-auction/${id}/${username}`);
  };

  const handleViewHistoryClick = (schemeIdObj) => {
    const schemeId = getSchemeId(schemeIdObj);
    navigate(`/user-auction-history/${username}/${schemeId}`);
  };

  return (
    <div className="schemes-container">
      <h1>Welcome, {username}!</h1>
      {/* Live Auctions Notification */}
      {liveAuctions.some((auction) => !auction.current_bid_status) && (
        <div className="live-auction-notification">
          {liveAuctions.map(
            (auction, idx) =>
              !auction.current_bid_status && (
                <div key={idx} className="live-auction-message">
                  <p>{auction.scheme_name}'s Auction is live.</p>
                  <button onClick={() => handleParticipateClick(auction.scheme_id)}>Click to participate</button>
                </div>
              )
          )}
        </div>
      )}

      <h2 style={{ color: 'white' }}>Registered Schemes</h2>
      <div className="schemes-grid">
        {schemes.registeredSchemes.map((scheme, index) => (
          <div key={index} className="scheme-card registered">
            <div className="icon-container">{iconMap[scheme.icon] || null}</div>
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
          <div key={index} className="scheme-card available">
            <div className="icon-container">{iconMap[scheme.icon] || null}</div>
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
