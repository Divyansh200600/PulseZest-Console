import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../utils/firebaseConfig';
import companyLogo from '../../../assets/2.png'; 

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [lastMarkedTime, setLastMarkedTime] = useState(null); // State to store last attendance marked time
  const [currentSection, setCurrentSection] = useState('profile'); // Default section to show

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        try {
          const employeeDetailsDocRef = doc(db, 'employeeDetails', userId);
          const employeeDetailsDocSnap = await getDoc(employeeDetailsDocRef);

          if (employeeDetailsDocSnap.exists()) {
            const userData = employeeDetailsDocSnap.data();
            setUserData(userData);
            fetchAttendanceData(userId);
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

  useEffect(() => {
    // Check if it's past 11:59 PM and attendance hasn't been marked
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to 11:59:59.999 PM

    if (now > endOfDay && !attendanceMarked) {
      markAttendance('absent');
    }
  }, [attendanceMarked]);

  const fetchAttendanceData = async (userId) => {
    const today = new Date();
    const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    const attendanceDocRef = doc(db, `employeeDetails/${userId}/attendance`, formattedDate);
    const attendanceDocSnap = await getDoc(attendanceDocRef);

    if (attendanceDocSnap.exists()) {
      setAttendanceData(attendanceDocSnap.data());
      setAttendanceMarked(true);
    } else {
      setAttendanceData({ attendance: 'absent' });
      setAttendanceMarked(false);
    }
  };

  const markAttendance = async (attendanceStatus) => {
    const user = auth.currentUser;
  
    if (user) {
      const userId = user.uid;
      const today = new Date();
      const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  
      // Mark current day's attendance
      const attendanceDocRef = doc(db, `employeeDetails/${userId}/attendance`, formattedDate);
  
      try {
        // Fetch previous day's attendance data
        const prevDay = new Date(today);
        prevDay.setDate(today.getDate() - 1); // Previous day
  
        const prevFormattedDate = `${prevDay.getDate()}-${prevDay.getMonth() + 1}-${prevDay.getFullYear()}`;
        const prevAttendanceDocRef = doc(db, `employeeDetails/${userId}/attendance`, prevFormattedDate);
        const prevAttendanceDocSnap = await getDoc(prevAttendanceDocRef);
  
        // Mark current day's attendance
        await setDoc(attendanceDocRef, {
          attendance: attendanceStatus,
          timestamp: serverTimestamp(),
        });
  
        // Update local state
        setAttendanceData({ attendance: attendanceStatus });
        setAttendanceMarked(true);
        setLastMarkedTime(today); // Update last marked time
  
        // Check and mark previous day as absent if today's attendance is marked
        if (attendanceStatus === 'present' && prevAttendanceDocSnap.exists()) {
          // Do nothing if previous day is already marked
        } else if (attendanceStatus === 'present' && !prevAttendanceDocSnap.exists()) {
          // Mark previous day as absent
          await setDoc(prevAttendanceDocRef, {
            attendance: 'absent',
            timestamp: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error marking attendance:', error);
      }
    }
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleDepartmentClick = (dept) => {
    // Implement your logic here
    console.log(`Clicked department: ${dept}`);
    // Example: Navigate to a department-specific page or show department details
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleViewFile = (fileUrl) => {
    // Implement your logic here
    window.open(fileUrl); // Opens the file in a new tab
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Welcome to Employee Dashboard!</h1>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </header>
        <main style={styles.main}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>User Data:</h2>
            <p>No user data found for Employee.</p>
          </div>
        </main>
      </div>
    );
  }

 // Display userData once loaded
return (

  <div>
    <header style={styles.header}>
  <div style={styles.titleContainer}>
    <h1 style={styles.title}>Welcome to PulseZest!</h1>
    <img src={companyLogo} alt="Company Logo" style={styles.companyLogo} />
  </div>
 
</header>


  <div style={styles.container}>
    <header style={styles.h1}>
      <h1 style={styles.title}>Welcome to Employee Dashboard!</h1>
      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </header>
    <main style={styles.main}>
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <button
            style={currentSection === 'profile' ? styles.activeSidebarButton : styles.sidebarButton}
            onClick={() => handleSectionChange('profile')}
          >
            Profile
          </button>
          <button
            style={currentSection === 'workingDepartment' ? styles.activeSidebarButton : styles.sidebarButton}
            onClick={() => handleSectionChange('workingDepartment')}
          >
           Department & Role
          </button>
          <button
            style={currentSection === 'documents' ? styles.activeSidebarButton : styles.sidebarButton}
            onClick={() => handleSectionChange('documents')}
          >
            Documents
          </button>
          <button
            style={currentSection === 'bank' ? styles.activeSidebarButton : styles.sidebarButton}
            onClick={() => handleSectionChange('bank')}
          >
            Bank Details
          </button>
          <button
            style={currentSection === 'attendance' ? styles.activeSidebarButton : styles.sidebarButton}
            onClick={() => handleSectionChange('attendance')}
          >
            Attendance
          </button>
        </div>
        {/* Content based on currentSection */}
        <div style={styles.content}>
          {currentSection === 'profile' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Profile</h2>
              <section style={styles.section}>
            <div style={styles.employeeDetails}>
              <div style={styles.avatarContainer}>
                <img src={userData.passportPhotoUrl} alt="Employee Avatar" style={styles.avatar} />
              </div>
              <div style={styles.personalInfo}>
                <h3 style={styles.subSectionTitle}>Personal Details</h3>
                <div style={styles.dataItems}>
                  <div style={styles.dataItem}>
                    <strong>Name:</strong> {userData.fullName}
                  </div>
                  <div style={styles.dataItem}>
                    <strong>Email:</strong> {userData.email}
                  </div>
                  <div style={styles.dataItem}>
                    <strong>Address:</strong> {userData.address}
                  </div>
                  <div style={styles.dataItem}>
                    <strong>Phone:</strong> {userData.phoneNumber}
                  </div>
                  <div style={styles.dataItem}>
                    <strong>Alternative Phone No:</strong> {userData.alternativePhoneNumber}
                  </div>
                  <div style={styles.dataItem}>
                    <strong>Microsoft Teams Id:</strong> {userData.teamsId}
                  </div>
                </div>
              </div>
            </div>
          </section>
          </section>
          
          )}
           {currentSection === 'workingDepartment' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Department & Role</h2>
              <section style={styles.section}>
           
            <div style={styles.dataItems}>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '5px' }}>
                {userData.department && userData.department.length > 0 ? (
                  userData.department.map((dept, index) => (
                    <span
                      key={index}
                      style={{
                        ...styles.departmentTag,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDepartmentClick(dept)}
                    >
                      {dept}
                    </span>
                  ))
                ) : (
                  <span>No department assigned</span>
                )}
              </div>
            </div>
          </section>
          </section>
          )}
          {currentSection === 'documents' && (
           <section style={styles.section}>
           <h3 style={styles.subSectionTitle}>Documents</h3>
           <div style={styles.dataItems}>
             {userData.passportPhotoUrl && (
               <div style={styles.dataItem}>
                 <strong>Passport Size Photo:</strong>
                 <button style={styles.viewButton} onClick={() => handleViewFile(userData.passportPhotoUrl)}>
                   View
                 </button>
               </div>
             )}
             {userData.resumeUrl && (
               <div style={styles.dataItem}>
                 <strong>Resume:</strong>
                 <button style={styles.viewButton} onClick={() => handleViewFile(userData.resumeUrl)}>
                   View
                 </button>
               </div>
             )}
             {userData.aadharCardUrl && (
               <div style={styles.dataItem}>
                 <strong>Aadhar Card:</strong>
                 <button style={styles.viewButton} onClick={() => handleViewFile(userData.aadharCardUrl)}>
                   View
                 </button>
               </div>
             )}
             {userData.panCardUrl && (
               <div style={styles.dataItem}>
                 <strong>Pan Card:</strong>
                 <button style={styles.viewButton} onClick={() => handleViewFile(userData.panCardUrl)}>
                   View
                 </button>
               </div>
             )}
           </div>
         </section>

          )}
          {currentSection === 'bank' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Bank Details</h2>
              <section style={styles.section}>
            <div style={styles.dataItem}>
              <strong>Account Holder Name:</strong> {userData.accountHolderName}
            </div>
            <div style={styles.dataItem}>
              <strong>Account Number:</strong> {userData.bankAccountNumber}
            </div>
            <div style={styles.dataItem}>
              <strong>IFSC Code:</strong> {userData.ifscCode}
            </div>
          </section>
          </section>
          )}
          {currentSection === 'attendance' && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Attendance</h2>
              {/* Attendance content here */}
              <div style={styles.dataItems}>
                {attendanceMarked ? (
                  <p>Attendance for today: {attendanceData.attendance}</p>
                ) : (
                  <button style={styles.markButton} onClick={() => markAttendance('present')}>
                    Mark Attendance
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  </div>
  </div>
);
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    margin: '0',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  main: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto', // Scrollbar for main content
    maxHeight: '60vh', // Limit height and add scroll bar when content exceeds
    flex: '1', // Fill remaining space in the flex container
  },
  sidebar: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    minWidth: '200px',
    marginRight: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarButton: {
    backgroundColor: '#ddd',
    color: '#333',
    border: 'none',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginBottom: '10px',
    textAlign: 'left',
    transition: 'background-color 0.3s ease',
  },
  activeSidebarButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginBottom: '10px',
    textAlign: 'left',
    transition: 'background-color 0.3s ease',
  },
  content: {
    flex: '1', // Fill remaining space in the flex container
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#555',
  },
  subSectionTitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#333',
  },
  dataItems: {
    marginTop: '10px',
  },
  dataItem: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  departmentTag: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    marginRight: '10px',
    marginBottom: '5px',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
    transition: 'background-color 0.3s ease',
  },
  employeeDetails: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: '20px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  personalInfo: {
    flex: '1',
  },
  markButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
    
  h1: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #ddd', // Add a border to separate header from content
    paddingBottom: '10px', // Add padding at the bottom of the header
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: '1', // Allow titleContainer to take up remaining space
    justifyContent: 'center', // Center align content horizontally
  },
  companyLogo: {
    width: 'auto',
    height: '40px', // Adjust the height as per your design
    marginLeft: '20px', // Adjust the margin as per your design
  },
 
};

export default EmployeeDashboard;
