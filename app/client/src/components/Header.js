import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Voice Clone
            </Link>
          </h1>
        </div>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0 }}>
            <li>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/record" style={{ color: 'white', textDecoration: 'none' }}>
                Record Voice
              </Link>
            </li>
            <li>
              <Link to="/voices" style={{ color: 'white', textDecoration: 'none' }}>
                Voices
              </Link>
            </li>
            <li>
              <Link to="/synthesize" style={{ color: 'white', textDecoration: 'none' }}>
                Text to Speech
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header; 