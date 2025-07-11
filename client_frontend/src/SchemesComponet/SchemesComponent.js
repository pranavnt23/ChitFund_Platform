import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { Coins, Diamond, Scale, Crown, GraduationCap, Plane, Heart, Smartphone, Stethoscope } from 'lucide-react';
import './SchemesComponent.css';

const SchemesComponent = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const schemes = [
        {
            title: "Gold Savings Scheme",
            description: "Members contribute monthly to accumulate gold or cash equivalent with flexible redemption options.",
            icon: <Coins className="scheme-icon" />,
            id: 1
        },
        {
            title: "Diamond Wealth Plan",
            description: "Premium investment plan for high-value luxury investments with exclusive diamond pieces or cash value.",
            icon: <Diamond className="scheme-icon" />,
            id: 2
        },
        {
            title: "Silver Harvest Scheme",
            description: "Affordable investment plan for medium-income groups looking to build wealth through silver.",
            icon: <Scale className="scheme-icon" />,
            id: 3
        },
        {
            title: "Platinum Prestige Scheme",
            description: "Elite investment option for higher-income investors seeking to diversify with platinum assets.",
            icon: <Crown className="scheme-icon" />,
            id: 4
        },
        {
            title: "Education Savings Scheme",
            description: "Plan for your children's future with our education-focused savings scheme for higher education.",
            icon: <GraduationCap className="scheme-icon" />,
            id: 5
        },
        {
            title: "Travel Dream Scheme",
            description: "Save towards your dream vacation with flexible redemption for travel packages or cash.",
            icon: <Plane className="scheme-icon" />,
            id: 6
        },
        {
            title: "Wedding Bliss Fund",
            description: "Make your special day perfect with our wedding savings scheme for all celebrations.",
            icon: <Heart className="scheme-icon" />,
            id: 7
        },
        {
            title: "Tech Gadget Scheme",
            description: "Stay up-to-date with the latest technology through our flexible gadget savings plan.",
            icon: <Smartphone className="scheme-icon" />,
            id: 8
        },
        {
            title: "Healthcare Savings Plan",
            description: "Prepare for medical expenses with our healthcare scheme offering flexible medical benefits.",
            icon: <Stethoscope className="scheme-icon" />,
            id: 9
        }
    ];

    // Function to handle "More" button click
    const handleMoreClick = (id) => {
        navigate(`/more/${id}`); // Navigate to MorePage with scheme ID
    };

    return (
        <div className="schemes-container">
            <div className="schemes-grid">
                {schemes.map((scheme, index) => (
                    <div key={index} className="scheme-card">
                        <div className="icon-container">
                            {scheme.icon}
                        </div>
                        <h3 className="card-title">{scheme.title}</h3>
                        <p className="card-description">{scheme.description}</p>
                        <button className="register-button" onClick={() => handleMoreClick(scheme.id)}>
                            More
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SchemesComponent;
