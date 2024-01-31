import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Button } from 'primereact/button';

import logoImage from './user.png';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const admin = decoded.user ? decoded.user.isAdmin : "Manager";
  

  let navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      to: '/home',
    },
    {
      label: 'Employee',
      icon: 'pi pi-user',
      to: '/employee',
    },
    {
      label: 'Company',
      icon: 'pi pi-building',
      to: '/company',
    },
    {
      label: 'Inventry',
      icon: 'pi pi-box',
      to: '/inventry',
    },
    {
      label: 'Register',
      icon: 'pi pi-bars',
      items: [
        {
          label: 'Employee',
          icon: 'pi pi-plus',
          command: () => navigate('/register'),
        },
        {
          label: 'Company',
          icon: 'pi pi-plus',
          command: () => navigate('/register_company'),
        },

      ],
      
    },
  ];

  const start = <img alt="logo" src={logoImage} height="40" className="mr-2"></img>;

  const end = (
    <div className="flex align-items-center gap-2">
      {admin && (
        <NavLink to="/signin">
          <i className="pi pi-user-plus mx-3 " size="large" style={{ color: '#708090', fontSize: '1.5rem' }}></i>
        </NavLink>
      )}

      <Button
        icon="pi pi-sign-out"
        className="p-button-text"
        style={{ color: '#708090', fontSize: '1.1rem' }}
        onClick={Logout}
      />
      {/* {username && (
        <div className="flex justify-content-end align-items-center mt-2">
          <Avatar label={username.charAt(0)} shape="circle" style={{ marginRight: '0.5rem' }} />
          <span className="p-d-none p-d-sm-inline-block">{username}</span>
        </div>
      )} */}
    </div>
  );

  return (
    <div className="card">
      <Menubar
        model={items.map((item) => ({
          ...item,
          template: () => (
            <NavLink to={item.to} className="flex align-items-center p-menuitem-link">
              <span className={item.icon} />
              <span className="mx-2">{item.label}</span>
              {item.badge && <Badge className="ml-auto" value={item.badge} />}
              {item.shortcut && (
                <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
                  {item.shortcut}
                </span>
              )}
            </NavLink>
          ),
        }))}
        
        start={start}
        end={end}
      />
      
    </div>
  );
}
