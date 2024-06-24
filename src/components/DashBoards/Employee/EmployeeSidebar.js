import React from 'react';
import { Link } from 'react-router-dom'; // Use Link from react-router-dom for navigation

const EmployeeSidebar = () => {
    return (
        <div className="bg-gray-800 text-white h-screen flex flex-col justify-between">
            <div className="p-4">
                <h1 className="text-xl font-bold">employee Dashboard</h1>
                <ul className="mt-4">
                    <li>
                        <Link to="/employee/profile" className="block text-gray-300 hover:text-white hover:bg-gray-700 py-2 px-4 rounded">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="/employee/tasks" className="block text-gray-300 hover:text-white hover:bg-gray-700 py-2 px-4 rounded mt-2">
                            Tasks
                        </Link>
                    </li>
                    <li>
                        <Link to="/employee/messages" className="block text-gray-300 hover:text-white hover:bg-gray-700 py-2 px-4 rounded mt-2">
                            Messages
                        </Link>
                    </li>
                    {/* Add more sidebar items as needed */}
                </ul>
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-400">&copy; 2024 employee Dashboard</p>
            </div>
        </div>
    );
};

export default EmployeeSidebar;