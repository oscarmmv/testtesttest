import { BrowserRouter, Route, Routes, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import ProjectPage from './components/ProjectPage';
import PageLoadAnimation from './components/PageLoadAnimation';
import Terminal from './components/Terminal';
import TerminalUserMetric from './components/TerminalUserMetric';
import React from 'react';
import './App.css';

function MainLayout() {
  const [loadTime, setLoadTime] = React.useState(null);
  const [lastLogin, setLastLogin] = React.useState(null);

  React.useEffect(() => {
    const now = new Date();
    setLoadTime(now.toLocaleString());
    setLastLogin(now.toLocaleString());
  }, []);

  return (
    <div className="App">
      <Terminal lastLogin={lastLogin} />
      <TerminalUserMetric/>
      <h1>oscar saul</h1>
      <p>Hey 👋, I'm a Computer Science and Business student focused on developing full-stack web applications and backend services. I have a strong interest in cybersecurity, fintech, and 3D modeling. Currently, I’m exploring the applications of Nmap's, modeling in Fusion 360, and automating arbitrage opportunities through web scraping. Want to learn more <Link to="/about">about me</Link>? 👈😎</p>
      <h2>Projects</h2>
      <ul>
        <li><Link to="/arbitrage-trader">Arbitrage Trader</Link> - a program that calculates profit opportunities across multiple sportsbooks</li>
        <li><Link to="/social-crawler">Social Crawler</Link> - a selenium based web crawler that retrieves users social media metrics.</li>
        <li><Link to="/ai-playlist">AI Playlist</Link> - a web based application that uses Open Ai api to generate a unique playlist.g</li>
        <li><Link to="/mouse-heatmap">Mouse Heatmap</Link> - lightweight application that stores mouse points and provides a playback of heatmap.</li>
        <li><Link to="/dns-config">DNS Configurator</Link> - python script that changes system DNS settings to Cloudflares resolvers.</li>
        <li><Link to="/tor-scout">Tor Scout</Link> - scrapes onion links on the Tor network, extracting HTML and cached assets for local storage, utilizing Tor proxies to maintain anonymity.</li>
      </ul>
      <div>
        <h2>Experience</h2>
        <p>Page loaded at: {loadTime}</p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <>
      {isMainPage && <PageLoadAnimation />}
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/arbitrage-trader" element={<ProjectPageWrapper projectId={1} />} />
        <Route path="/social-crawler" element={<ProjectPageWrapper projectId={1} />} />
        <Route path="/ai-playlist" element={<ProjectPageWrapper projectId={1} />} />
        <Route path="/mouse-heatmap" element={<ProjectPageWrapper projectId={2} />} />
        <Route path="/dns-config" element={<ProjectPageWrapper projectId={2} />} />
        <Route path="/tor-scout" element={<ProjectPageWrapper projectId={2} />} />
      </Routes>
    </>
  );
}

const ProjectPageWrapper = ({ projectId }) => {
  return <ProjectPage projectId={projectId} />;
};

export default App;