import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { profileName } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка на отсутсвиве profileName
  useEffect(() => {
    if (!profileName) {
      setError("Имя пользователя не найдено!");
      setLoading(false);
      return;
    }

    // Таймаут если завис запрос
    const timeout = setTimeout(() => {
      if (loading) {
        setError("Ошибка: Сервер не отвечает.");
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [profileName]);

  if (loading) return <p>Загрузка профиля...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      {/* Здесь будет контент личного кабинета */}
    </div>
  );
};

export default Profile;