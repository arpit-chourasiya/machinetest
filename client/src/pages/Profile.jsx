/** @format */

import React from "react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        <div className="profile-info">
          <div className="info-group">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-group">
            <label>Role:</label>
            <span className={`role-badge ${user.role}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
          <div className="info-group">
            <label>Member Since:</label>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
