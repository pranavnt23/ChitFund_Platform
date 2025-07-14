import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Link, useLocation } from 'react-router-dom';
import './App.css';
import logo from './images/FundLogo-removebg-preview.png'; // Import your logo
import LoginComponent from './LoginComponent/LoginComponent';
import LoginSchemeComponent from './LoginSchemeComponent/LoginSchemeComponent';
import RegisterComponent from './RegisterComponent/RegisterComponent';
import AboutComponent from './AboutComponent/AboutComponent';
import ContactComponent from './ContactComponent/ContactComponent';
import FaqComponent from './FaqComponent/FaqComponent';
import Home from './Home';
import Footer from './FooterComponent/FooterComponent';
import SchemesComponent from './SchemesComponet/SchemesComponent';
import MorePage from './SchemesComponet/MorePage';

const ScrollToTop = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (e, path) => {
    e.preventDefault();

    // Handle navigation based on path
    if (path === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (['/schemes', '/login', '/register'].includes(path)) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: path } });
      } else {
        const sectionId = path.replace('#', '');
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="fundverse-header">
      <div className="logo-section">
        <img src={logo} alt="Fundverse logo" />
        <span className="fundverse-title">FUNDVERSE</span>
      </div>
      <nav className="main-nav">
        <Link to="/" onClick={(e) => handleNavigation(e, '/')}>HOME</Link>
        <Link to="#about-section" onClick={(e) => handleNavigation(e, '#about-section')}>ABOUT</Link>
        <Link to="/schemes" onClick={(e) => handleNavigation(e, '/schemes')}>SCHEMES</Link>
        <Link to="#faqs-section" onClick={(e) => handleNavigation(e, '#faqs-section')}>FAQs</Link>
        <Link to="#contact-section" onClick={(e) => handleNavigation(e, '#contact-section')}>CONTACT</Link>
      </nav>
      <div className="auth-section">
        <Link to="/login" onClick={(e) => handleNavigation(e, '/login')}>LOGIN</Link>
        <Link to="/register" onClick={(e) => handleNavigation(e, '/register')}>REGISTER</Link>
      </div>
    </header>
  );
};

function HomePage() {
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <section id="home-section">
        <Home />
      </section>
      <section id="about-section">
        <AboutComponent />
      </section>
      <section id="faqs-section">
        <FaqComponent />
      </section>
      <section id="contact-section">
        <ContactComponent />
      </section>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schemes" element={<SchemesComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/api/schemes/:username" element={<LoginSchemeComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/more/:id" element={<MorePage />} /> 
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
