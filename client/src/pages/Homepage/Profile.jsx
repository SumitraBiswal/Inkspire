
import React from "react";

import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { useNavigate } from "react-router-dom";
import "../Style/Profile.css";
import { useAuth } from "../../Context/Authcontext.jsx";

const Profile = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-empty">
        <h2>You are not logged in</h2>
        <button onClick={() => navigate("/login")} className="profile-login-btn">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-icon">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="profile-actions">
        <button onClick={() => navigate("/edit-profile")} className="profile-btn">
          Edit Profile
        </button>
        <button onClick={() => navigate("/wishlist")} className="profile-btn">
          My Wishlist ({wishlist.length})
        </button>
        <button onClick={() => navigate("/cart")} className="profile-btn">
          My Cart ({cart.items?.length||0})
        </button>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;