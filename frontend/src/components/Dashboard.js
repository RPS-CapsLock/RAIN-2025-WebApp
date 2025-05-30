import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <p>Welcome, Owner! This is your dashboard.</p>
    </div>
  );
}

export default Dashboard;