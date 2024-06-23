// components/AdminControl.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminControl = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('YOUR_CLOUD_FUNCTION_ENDPOINT_URL');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map(user => (
          <li key={user.uid}>
            <strong>Email:</strong> {user.email}<br />
            <strong>UID:</strong> {user.uid}<br />
            {/* Display additional fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminControl;
