import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';
import './Terminal.css';

const TerminalUserMetric = () => {
    const [userMetrics, setUserMetrics] = useState({
        ip: '',
        city: '',
        region: '',
        country: '',
        org: '',
        connectionType: '',
    });
    const [isMaximized, setIsMaximized] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [disableDragging, setDisableDragging] = useState(false);
    const [prevPosition, setPrevPosition] = useState({ x: 500, y: 300 });
    const [prevSize, setPrevSize] = useState({ width: 500, height: 300 });
    const [isActive, setIsActive] = useState(true);
    const rndRef = useRef(null);

    useEffect(() => {
        const fetchUserMetrics = async () => {
            try {
                const response = await axios.get(`https://ipinfo.io?token=YOUR_API_KEY`);
                const { ip, city, region, country, org } = response.data;
                setUserMetrics({
                    ip: ip || 'xxx.xxx.xxx:xx',
                    city: city || 'Unknown',
                    region: region || 'Unknown',
                    country: country || 'Unknown',
                    org: org || 'Unknown',
                    connectionType: navigator.connection?.effectiveType || 'Unknown',
                });
            } catch (error) {
                console.error("Error fetching user metrics:", error);
                setUserMetrics(prevMetrics => ({
                    ...prevMetrics,
                    ip: prevMetrics.ip || 'xxx.xxx.xxx:xx',
                    city: prevMetrics.city || 'Unknown',
                    region: prevMetrics.region || 'Unknown',
                    country: prevMetrics.country || 'Unknown',
                    org: prevMetrics.org || 'Unknown',
                    connectionType: prevMetrics.connectionType || 'Unknown',
                }));
            }
        };
        fetchUserMetrics();
    }, []);
    

    useEffect(() => {
        if (rndRef.current) {
            if (isMaximized) {
                const rect = rndRef.current.resizableElement.current.getBoundingClientRect();
                setPrevPosition({ x: rect.left, y: rect.top });
                setPrevSize({ width: rect.width, height: rect.height });
                rndRef.current.updatePosition({ x: 0, y: 0 });
                rndRef.current.updateSize({ width: '100vw', height: '100vh' });
                document.body.classList.add('no-overflow');
            } else {
                rndRef.current.updatePosition(prevPosition);
                rndRef.current.updateSize(prevSize);
                document.body.classList.remove('no-overflow');
            }
        }
    }, [isMaximized]);

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleMinimize = (active) => {
        setIsMinimized(true);
        setIsVisible(false);
        setIsActive(active);
    };

    const handleRestore = () => {
        setIsMinimized(false);
        setIsVisible(true);
        setDisableDragging(false); // Reset disableDragging state
    };

    const handleMouseEnter = () => {
        setDisableDragging(true);
    };

    const handleMouseLeave = () => {
        setDisableDragging(false);
    };

    const handleHeaderDoubleClick = () => {
        handleMaximize();
    };

    return (
        <>
            {isVisible && (
                <Rnd
                    ref={rndRef}
                    default={{
                        x: 500,
                        y: 300,
                        width: 500,
                        height: 300,
                    }}
                    minWidth={200}
                    minHeight={100}
                    bounds="window"
                    className="terminal-window"
                    disableDragging={disableDragging}
                >
                    <section
                        className="terminal"
                        style={{ overflow: 'auto', height: '100%' }}
                    >
                        <div className="terminal-header" onDoubleClick={handleHeaderDoubleClick}>
                            <div className="terminal-dots">
                                <span className="dot red" onClick={() => handleMinimize(false)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></span>
                                <span className="dot yellow" onClick={() => handleMinimize(true)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></span>
                                <span className="dot green" onClick={handleMaximize} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></span>
                            </div>
                        </div>
                        <div className="terminal-content">
                            <p>Welcome to the user metrics terminal.</p>
                            <p>Here you can display various user metrics and statistics.</p>
                            <ul>
                                <li>IP: {userMetrics.ip}</li>
                                <li>Geolocation: {userMetrics.city}, {userMetrics.region}, {userMetrics.country}</li>
                                <li>Internet Provider: {userMetrics.org}</li>
                                <li>Connection Type: {userMetrics.connectionType}</li>
                                <li>Browser: {navigator.userAgent}</li>
                                <li>OS: {navigator.platform}</li>
                            </ul>
                        </div>
                    </section>
                </Rnd>
            )}
            {isMinimized && (
                <div className="dock">
                    <button className="restore-button" onClick={handleRestore}>
                        <span className="app-icon">T</span>
                        {isActive && <span className="app-dot"></span>}
                    </button>
                </div>
            )}
        </>
    );
};

export default TerminalUserMetric;
