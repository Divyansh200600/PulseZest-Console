import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../utils/firebaseConfig';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
    return date.toLocaleDateString(); // Format Date as a locale date string
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        try {
          const employeeDetailsDocRef = doc(collection(db, 'employeeDetails'), userId);
          const employeeDetailsDocSnap = await getDoc(employeeDetailsDocRef);

          if (employeeDetailsDocSnap.exists()) {
            const userData = employeeDetailsDocSnap.data();

            // Handle Firebase Timestamps if present
            if (userData && userData.startDate) {
              userData.startDate = userData.startDate.toDate(); // Convert Firebase Timestamp to Date object
            }

            setUserData(userData);
          } else {
            console.log('No matching document for Employee.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Employee Dashboard!</h1>
          <button
            style={{
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.3s ease',
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>
        <main style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>User Data:</h2>
            <p>No user data found for Employee.</p>
          </div>
        </main>
      </div>
    );
  }

  // Display userData once loaded
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Employee Dashboard!</h1>
      <button
        style={{
          backgroundColor: '#f44336',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '4px',
          transition: 'background-color 0.3s ease',
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
    <main style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>User Data: <span style={{ fontWeight: 'normal' }}>{userData.userId}</span></h2>

        <div style={{ backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '4px' }}>
          {Object.keys(userData).map((key) => (
            <div key={key} style={{ marginBottom: '15px' }}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> 
              {typeof userData[key] === 'object' && userData[key] !== null && userData[key].hasOwnProperty('seconds') ?
                formatDate(userData[key]) : userData[key]}
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
  );
};

export default EmployeeDashboard;
