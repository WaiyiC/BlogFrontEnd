import 'antd/dist/reset.css';
import React from "react";
import { getCurrentUser } from "../services/auth.service";
import './Profile.css'; // Import your custom CSS file

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();

  console.log('current user' + JSON.stringify(currentUser));
  console.log(localStorage.getItem("token"));

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2 className="profile-header">
          <strong>{currentUser.username}</strong> Profile
        </h2>

        <table className="profile-table" rules="all">
          <thead>
            <tr>
              <th>User ID</th>
              <td>{currentUser.id}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Username</th>
              <td>{currentUser.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{currentUser.email}</td>
            </tr>
            <tr>
              <th>About me</th>
              <td>{currentUser.about}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{currentUser.role}</td>
            </tr>
            <tr>
              <th>Login token</th>
              <td>{localStorage.getItem("token")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
