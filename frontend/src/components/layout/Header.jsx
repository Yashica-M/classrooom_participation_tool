import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <h1>Classroom Participation Tool</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/student-dashboard">Student Dashboard</Link></li>
                    <li><Link to="/instructor-dashboard">Instructor Dashboard</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;