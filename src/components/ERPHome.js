import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './ERPHome.css';

const ERPHome = () => {
    const navigate = useNavigate();

    const navigateTo = () => {
        navigate('/login');
    };

    return (
        <div className="erp-home-container">
            {[...Array(150)].map((_, index) => (
                <div
                    key={index}
                    className="star"
                    style={{
                        top: `${Math.random() * 100}vh`,
                        left: `${Math.random() * 100}vw`,
                        animationDelay: `${Math.random()}s`,
                    }}
                />
            ))}
            <Button className="bg-gray-900 hover:bg-blue-900 text-white" label="Login" onClick={navigateTo} text raised />
            
            {/* <div className="moon"></div> */}
        </div>
    );
};

export default ERPHome;
