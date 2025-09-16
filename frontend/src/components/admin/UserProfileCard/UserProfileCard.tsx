import React from "react";
import type { UserDetail } from "../../../hooks/Users/useUserDetail";
import "./UserProfileCard.css";

interface UserProfileCardProps {
  user: UserDetail;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  // Create initials from first and last name
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // Format date to local string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="user-profile-card">
      <div className="user-profile-card__header">
        <div className="user-profile-card__avatar">{initials}</div>
        <div className="user-profile-card__name-section">
          <h2 className="user-profile-card__name">
            {user.firstName} {user.lastName}
          </h2>
          {user.companyName && (
            <p className="user-profile-card__company">{user.companyName}</p>
          )}
        </div>
      </div>

      <div className="user-profile-card__info">
        <div className="user-profile-card__info-item">
          <span className="user-profile-card__info-label">Email</span>
          <span className="user-profile-card__info-value">{user.email}</span>
        </div>
        <div className="user-profile-card__info-item">
          <span className="user-profile-card__info-label">UUID</span>
          <span className="user-profile-card__info-value">{user.uuid}</span>
        </div>
        <div className="user-profile-card__info-item">
          <span className="user-profile-card__info-label">Lid sinds</span>
          <span className="user-profile-card__info-value">
            {formatDate(user.dateJoined)}
          </span>
        </div>
        {user.lastLogin && (
          <div className="user-profile-card__info-item">
            <span className="user-profile-card__info-label">Laatste Login</span>
            <span className="user-profile-card__info-value">
              {formatDate(user.lastLogin)}
            </span>
          </div>
        )}
      </div>

      <div className="user-profile-card__stats">
        <div className="user-profile-card__stat">
          <div className="user-profile-card__stat-value">
            {user.formsFilled.length}
          </div>
          <div className="user-profile-card__stat-label">
            Formulieren ingeleverd
          </div>
        </div>
      </div>
    </div>
  );
};
