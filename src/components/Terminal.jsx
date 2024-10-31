import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import './Terminal.css';

const Terminal = ({ lastLogin }) => {
    const [displayedLines, setDisplayedLines] = useState([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1); // Start with -1 to delay the start
    const [currentCommand, setCurrentCommand] = useState('');
    const [isMaximized, setIsMaximized] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [disableDragging, setDisableDragging] = useState(false);
    const [prevPosition, setPrevPosition] = useState({ x: 500, y: 300 });
    const [prevSize, setPrevSize] = useState({ width: 500, height: 300 });
    const [isActive, setIsActive] = useState(true);
    const terminalRef = useRef(null);
    const rndRef = useRef(null);

    const lines = [
        { type: 'prompt', text: `(kali@kali)-[~]` },
        { type: 'command', text: `$ geoiplookup $(curl -s ifconfig.me)` },
        { type: 'response', text: `GeoIP Country Edition: CA, Canada` },
        { type: 'response', text: `GeoIP City Edition, Rev 1: CA, ON, Waterloo, 43.4748 , -80.5542` },
        { type: 'prompt', text: `(kali@kali)-[~]` },
        { type: 'command', text: `$ jq '.' ContactInfo.json` },
        { type: 'response', text: `["oscarsaul.mmv@gmail.com", "LinkedIn", "GitHub"]` },
        { type: 'prompt', text: `(kali@kali)-[~]` },
        { type: 'command', text: `$ ls ~/Documents | grep resume.pdf` },
        { type: 'response', text: `resume.pdf` },
        { type: 'prompt', text: `(kali@Oscars-Laptop)-[~]` },
        { type: 'command', text: `$ ssh saul8942@laurier.edu "cat ~/degree.txt"` },
        { type: 'response', text: `Degree: Honours Bachelor of Science` },
        { type: 'response', text: `Major: Computer Science and Management` },
        { type: 'response', text: `University: Wilfrid Laurier University` },
        { type: 'prompt', text: `(kali@Oscars-Laptop)-[~]` },
        { type: 'command', text: `$ tree -t ./TechStack` },
        { type: 'node', text: `./TechStack` },
        { type: 'leaf', text: `Programming_Languages: Python, JS, C#, C++, SQL` },
        { type: 'leaf', text: `Frameworks: React, Express.js, Django, Flask` },
        { type: 'leaf', text: `Tools: Git, Docker, VSCode, Kali Linux, Node.js` },
        { type: 'leaf', text: `Platforms: AWS, Heroku, Raspberry Pi, Firebase` },
        { type: 'leaf', text: `Databases: MySQL, PostgreSQL, MongoDB` },
    ];

    useEffect(() => {
        const startSimulation = setTimeout(() => {
            setCurrentLineIndex(0);
        }, 3000); // Delay of 3 seconds

        return () => clearTimeout(startSimulation);
    }, []);

    useEffect(() => {
        if (currentLineIndex >= 0 && currentLineIndex < lines.length) {
            const line = lines[currentLineIndex];
            if (line.type === 'command') {
                let charIndex = 0;
                const typingInterval = setInterval(() => {
                    setCurrentCommand((prev) => prev + (line.text[charIndex] || ''));
                    charIndex++;
                    if (charIndex === line.text.length) {
                        clearInterval(typingInterval);
                        setTimeout(() => {
                            setDisplayedLines((prev) => [...prev, { ...line, text: line.text }]);
                            setCurrentCommand('');
                            setCurrentLineIndex((prev) => prev + 1);
                        }, 500);
                    }
                }, 100 + Math.random() * 50); // Random deviation in typing speed
            } else {
                setDisplayedLines((prev) => [...prev, line]);
                setCurrentLineIndex((prev) => prev + 1);
            }
        }
    }, [currentLineIndex]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [displayedLines, currentCommand]);

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
                        ref={terminalRef}
                    >
                        <div className="terminal-header" onDoubleClick={handleHeaderDoubleClick}>
                            <div className="terminal-dots">
                                <span className="dot red" onClick={() => handleMinimize(false)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></span>
                                <span className="dot yellow" onClick={() => handleMinimize(true)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></span>
                                <span className="dot green" onClick={handleMaximize} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}></span>
                            </div>
                        </div>
                        <ul>
                            <p>Last login: {lastLogin} on tty1</p>
                            {displayedLines.map((line, index) => (
                                <p
                                    key={index}
                                    className={line.type}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {line.text}
                                </p>
                            ))}
                            {currentCommand && (
                                <p className="command" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                    {currentCommand}
                                    <span className="blinking-cursor">&nbsp;</span>
                                </p>
                            )}
                        </ul>
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

export default Terminal;