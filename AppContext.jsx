import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [customers, setCustomers] = useState([
    {
      id: 'cust-1',
      name: 'Emily Carter',
      email: 'emily.carter@gmail.com',
      phone: '+1 (555) 012-3456',
      dob: '1992-05-14',
      joined: '2026-01-15',
      policies: ['PD-HL-98821', 'PD-LF-48592']
    },
    {
      id: 'cust-2',
      name: 'Marcus Vance',
      email: 'marcus.vance@yahoo.com',
      phone: '+1 (555) 987-6543',
      dob: '1988-11-20',
      joined: '2026-01-18',
      policies: ['PD-HL-11223']
    },
    {
      id: 'cust-3',
      name: 'Sophia Lane',
      email: 'sophia.lane@outlook.com',
      phone: '+1 (555) 456-7890',
      dob: '1995-03-02',
      joined: '2026-01-22',
      policies: ['PD-LF-99887']
    }
  ]);

  const [claims, setClaims] = useState([
    { id: 'CLM-01', customerId: 'cust-3', status: 'Pending', amount: '$1,500' }
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);

  return (
    <AppContext.Provider value={{ 
      customers, 
      setCustomers, 
      claims, 
      setClaims, 
      selectedCustomer, 
      setSelectedCustomer 
    }}>
      {children}
    </AppContext.Provider>
  );
}
