import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import Header from '../../Header/Header';
import axios from 'axios';

const Profile = () => {
  const { profileName } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(localStorage.getItem('username') || '');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  });

  // Загрузка данных профиля
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Требуется авторизация");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        setUserData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        setError("Ошибка загрузки данных профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileName]);

  // Обработчик изменения полей
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Сохранение изменений
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/profile/${profileName}`, userData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      setError("Ошибка сохранения данных");
    }
  };

  if (loading) return <p>Загрузка профиля...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-container">
      <Header userName={userName} setUserName={setUserName} />
      <div className='mainBlockProfileContent'>
        <div className='firstContent'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Личные данные пользователя:</h2>
          </div>

          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Имя:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span className="info-value">{userData.firstName}</span>
              )}
            </div>

            <div className="info-row">
              <span className="info-label">Фамилия:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span className="info-value">{userData.lastName}</span>
              )}
            </div>

            <div className="info-row">
              <span className="info-label">Возраст:</span>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span className="info-value">{userData.age}</span>
              )}
            </div>

            <div className="info-row">
              <span className="info-label">Пол:</span>
              {isEditing ? (
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleInputChange}
                  className="profile-input"
                >
                  <option value="Не указано">Не указано</option>
                  <option value="Мужской">Мужской</option>
                  <option value="Женский">Женский</option>
                  <option value="Другой">Другой</option>
                </select>
              ) : (
                <span className="info-value">{userData.gender}</span>
              )}
            </div>

            <div className="info-row">
              <span className="info-label">Телефон:</span>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={(e) => {
                    const cleanedValue = e.target.value.replace(/\D/g, '');
                    setUserData(prev => ({
                      ...prev,
                      phone: cleanedValue
                    }));
                  }}
                  className="profile-input"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength="11"
                  placeholder="Введите номер 79..."
                />
              ) : (
                <span className="info-value">
                  {userData.phone ? `+${userData.phone}` : ''}
                </span>
              )}
            </div>

            <div className="info-row">
              <span className="info-label">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <span className="info-value">{userData.email}</span>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className="button-group">
              <button onClick={handleSave} className="btnRefac2">Сохранить</button>
              <button onClick={() => setIsEditing(false)} className="btnRefac2">Отмена</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btnRefac">Редактировать</button>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;