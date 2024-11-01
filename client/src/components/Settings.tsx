import { useDispatch, useSelector } from 'react-redux';
import { useState, useRef } from 'react';
import { updateProfile } from '../store/slices/authSlice.js';
import { RootState } from '../store/store.js';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    currentPassword: '',
    newPassword: '',
  });
  const [profileImage, setProfileImage] = useState(user?.profilePicture || '');

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      dispatch(updateProfile(formData));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Profile Settings
            </h2>
            <div className="grid gap-4">
              <div className="flex items-center space-x-4">
                <div
                  className="w-20 h-20 rounded-full cursor-pointer overflow-hidden"
                  onClick={handleImageClick}
                >
                  <img
                    src={profileImage || '/default-avatar.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  onClick={handleImageClick}
                >
                  Change Photo
                </button>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  className="p-2 border rounded-lg bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          </section>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
