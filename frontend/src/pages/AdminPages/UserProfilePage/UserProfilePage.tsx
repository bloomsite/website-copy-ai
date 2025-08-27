import React from "react";
import { useParams } from "react-router-dom";
import { UserProfileCard } from "../../../components/admin/UserProfileCard/UserProfileCard";
import { UserFormsCards } from "../../../components/admin/UserFormsCards/UserFormsCards";
import { useUserDetail } from "../../../hooks/Users/useUserDetail";
import type { FormSubmission } from "../../../hooks/Users/useUserDetail";
import "./UserProfilePage.css";
import NavigationSidebar from "../../../components/custom/NavigationSidebar/NavigationSidebar";
import { sidebarItems } from "../../../core/Constants/sidebarItemsAdmin";

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { userDetail, loading, error } = useUserDetail(userId);
  if (loading) {
    return (
      <div className="user-detail-page">
        <div className="user-detail-page__header">
          <h1 className="user-detail-page__title">Gegevens inladen...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-detail-page">
        <div className="user-detail-page__header">
          <h1 className="user-detail-page__title">Error</h1>
          <p className="user-detail-page__subtitle">{error}</p>
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="user-detail-page">
        <div className="user-detail-page__header">
          <h1 className="user-detail-page__title">Gebruiker niet gevonden</h1>
          <p className="user-detail-page__subtitle">
            De gebruiker is niet gevonden.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationSidebar sidebarItems={sidebarItems} sidebarTitle="Admin" />
      <div className="user-detail-page">
        <div className="user-detail-page__header">
          <h1 className="user-detail-page__title">Gebruikersprofiel</h1>
        </div>

        <div className="user-detail-page__content">
          <div className="user-detail-page__profile-section">
            <UserProfileCard user={userDetail} />
          </div>
          <UserFormsCards
            forms={userDetail.formsFilled}
            onViewForm={(form: FormSubmission) => {
              // TODO: Implement form view logic
              console.log("Opening form:", form);
            }}
          />
        </div>
      </div>
    </>
  );
};
