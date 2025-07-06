import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../SideBar/Sidebar";
import Notificacao from "../../Notificacao/Notificacao";
import UserImage from "../../../../img/user.jpg";

const UserProfile = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState(UserImage);
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || decoded.preferred_username);
        setUserEmail(decoded.email || "");
        const userId = decoded.sub;

        const fileRes = await fetch(
          `http://gaetec-server.tailf2d209.ts.net:8000/user/api/UserHasFile/?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fileData = await fileRes.json();
        if (Array.isArray(fileData) && fileData.length > 0) {
          const fileId = fileData[0].fileId;

          const imageRes = await fetch(
            `http://gaetec-server.tailf2d209.ts.net:8000/file/api/file/${fileId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const imageData = await imageRes.json();
          const { fileBytes, extension } = imageData;
          setUserImage(`data:image/${extension};base64,${fileBytes}`);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setUserImage(UserImage);
      }
    };

    fetchUserInfo();
  }, [token]);

  return (
    <div className="App body">
      <Sidebar />
      <Notificacao />
      <div className="user-profile-wrapper">
        <div className="user-profile-card">
          <div className="user-profile-image">
            <img src={userImage} alt="Imagem de perfil" />
          </div>
          <div className="user-profile-info">
            <h2>{userName}</h2>
            {userEmail && <p>{userEmail}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
