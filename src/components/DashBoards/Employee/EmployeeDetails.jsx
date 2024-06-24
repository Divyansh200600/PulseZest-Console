import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebaseConfig';

const EmployeeDetails = () => {
  const { userId } = useParams(); // Fetch userId from URL params

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to store error

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (!userId) {
          throw new Error('No userId provided.');
        }
  
        const employeeDetailsDocRef = doc(collection(db, 'employeeDetails'), userId);
        const employeeDetailsDocSnap = await getDoc(employeeDetailsDocRef);
  
        if (employeeDetailsDocSnap.exists()) {
          const data = employeeDetailsDocSnap.data();
          setEmployeeData(data);
        } else {
          console.log('No matching document for Employee.');
          setError('No data found for this employee.');
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError('Error fetching employee data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) {
      fetchEmployeeData();
    } else {
      setError('No userId provided.');
      setLoading(false);
    }
  }, [userId]);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>; // Render error message if there's an error
  }

  if (!employeeData) {
    return <p>No data found for this employee.</p>;
  }
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Employee Details</h1>
      </header>
      <main style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Personal Information:</h2>
          <div style={{ backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '4px' }}>
            <p><strong>Full Name:</strong> {employeeData.fullName}</p>
            <p><strong>Email:</strong> {employeeData.email}</p>
            <p><strong>Phone Number:</strong> {employeeData.phoneNumber}</p>
            <p><strong>Alternative Phone Number:</strong> {employeeData.alternativePhoneNumber}</p>
            <p><strong>Date of Registration:</strong> {employeeData.dateOfRegistration.toDate().toLocaleString()}</p>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Bank Information:</h2>
          <div style={{ backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '4px' }}>
            <p><strong>Bank Name:</strong> {employeeData.bankName}</p>
            <p><strong>Bank Account Number:</strong> {employeeData.bankAccountNumber}</p>
            <p><strong>IFSC Code:</strong> {employeeData.ifscCode}</p>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Documents:</h2>
          <div style={{ backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '4px' }}>
            <p><strong>Resume:</strong> <a href={employeeData.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
            <p><strong>PAN Card:</strong> <a href={employeeData.panCardUrl} target="_blank" rel="noopener noreferrer">View PAN Card</a></p>
            <p><strong>Aadhar Card:</strong> <a href={employeeData.aadharCardUrl} target="_blank" rel="noopener noreferrer">View Aadhar Card</a></p>
            <p><strong>Passport Photo:</strong> <a href={employeeData.passportPhotoUrl} target="_blank" rel="noopener noreferrer">View Passport Photo</a></p>
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Other Details:</h2>
          <div style={{ backgroundColor: '#fff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '4px' }}>
            <p><strong>Department(s):</strong></p>
            <ul>
              {employeeData.department && employeeData.department.map((dept, index) => (
                <li key={index}>{dept}</li>
              ))}
            </ul>
            <p><strong>Teams ID:</strong> {employeeData.teamsId}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDetails;
