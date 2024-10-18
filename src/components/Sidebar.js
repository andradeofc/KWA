import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" activeClassName="active">Buscar Criativos</NavLink>
                    </li>
                    <li>
                        <NavLink to="/account-search" activeClassName="active">Buscar Conta</NavLink>
                    </li>
                    <li>
                        <NavLink to="/download-creative" activeClassName="active">Download Criativo</NavLink> {/* Novo Link */}
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
