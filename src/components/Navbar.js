import React, { useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Button } from 'primereact/button';

import logoImage from './user.png';

export default function Navbar() {
  const token = sessionStorage.getItem('token');
  const [isAdmin, setIsAdmin] = useState(false);

  let navigate = useNavigate();

  const Logout = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.user ? decoded.user.role === "Admin" : "Manager");
    }
  }, [token]);

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      to: '/home',
    },
    {
      label: 'Employee',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Employee Data',
          icon: 'pi pi-database',
          command: () => navigate('/employee'),
        },
        {
          label: 'Leaves',
          icon: 'pi pi-reply',
          command: () => navigate('/Leaves'),
        },
        {
          label: 'Loans',
          icon: 'pi pi-wallet',
          command: () => navigate('/Loan'),
        },
      ],
    },
    {
      label: 'Company',
      icon: 'pi pi-building',
      to: '/company',
    },
    {
      label: 'Puchases',
      icon: 'pi pi-box',
      items: [
        {
          label: 'Purchase Item',
          icon: 'pi pi-ticket',
          command: () => navigate('/addPurchase'),
        },
        {
          label: 'Prchase Table',
          icon: 'pi pi-database',
          command: () => navigate('/Purchase'),
        },
      ]
    },
    {
      label: 'Salary',
      icon: 'pi pi-money-bill',
      items: [
        {
          label: 'Salary',
          icon: 'pi pi-database',
          command: () => navigate('/salary'),
        },
        {
          label: 'Generate Salary',
          icon: 'pi pi-ticket',
          command: () => navigate('/generateSalary'),
        },
      ]
    },
    {
      label: 'Product',
      icon: 'pi pi-shopping-bag',
      items: [
        {
          label: 'Sell Product',
          icon: 'pi pi-shopping-cart',
          command: () => navigate('/sellProduct'),
        },
        {
          label: 'List',
          icon: 'pi pi-list',
          command: () => navigate('/outProduct'),
        },
      ],
    },
    {
      label: 'Bank Account',
      icon: 'pi pi-home',
      to: '/account',
    },
    // {
    //   label: 'Register',
    //   icon: 'pi pi-bars',
    //   items: [
    //     {
    //       label: 'Employee',
    //       icon: 'pi pi-plus',
    //       command: () => navigate('/register'),
    //     },
    //     {
    //       label: 'Company',
    //       icon: 'pi pi-plus',
    //       command: () => navigate('/register_company'),
    //     },
    //   ],
    // },
  ];

  const start = <img alt="logo" src={logoImage} height="40" className="mr-2"></img>;

  const end = (
    <div className="flex align-items-center gap-2">
      {isAdmin && (
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
