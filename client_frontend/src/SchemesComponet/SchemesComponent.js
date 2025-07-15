import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Diamond, Scale, Crown, GraduationCap, Plane, Heart, Smartphone, Stethoscope } from 'lucide-react';
import './SchemesComponent.css';

const iconMap = {
    Gold: <Coins className="scheme-icon" />,
    Diamond: <Diamond className="scheme-icon" />,
    Silver: <Scale className="scheme-icon" />,
    Platinum: <Crown className="scheme-icon" />,
    Education: <GraduationCap className="scheme-icon" />,
    Travel: <Plane className="scheme-icon" />,
    Wedding: <Heart className="scheme-icon" />,
    Tech: <Smartphone className="scheme-icon" />,
    Healthcare: <Stethoscope className="scheme-icon" />
};

const SchemesComponent = () => {
    const navigate = useNavigate();
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/schemes/');
                if (!response.ok) throw new Error('Failed to fetch schemes');
                const data = await response.json();
                setSchemes(data);
            } catch (err) {
                console.error('Error fetching schemes:', err);
                setError('Unable to load schemes.');
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, []);

    const handleMoreClick = (id) => {
        navigate(`/more/${id}`);
    };

    if (loading) return <div>Loading schemes...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="schemes-container">
            <div className="schemes-grid">
                {schemes.map((scheme, index) => {
                    const prefix = scheme.name.split(' ')[0]; // e.g., Gold, Diamond etc.
                    const icon = iconMap[prefix] || <Coins className="scheme-icon" />; // fallback icon

                    return (
                        <div key={index} className="scheme-card">
                            <div className="icon-container">
                                {icon}
                            </div>
                            <h3 className="card-title">{scheme.name}</h3>
                            <p className="card-description">{scheme.description}</p>
                            <button className="register-button" onClick={() => handleMoreClick(scheme._id)}>
                                More
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SchemesComponent;
