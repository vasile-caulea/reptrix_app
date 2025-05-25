import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUserProfile, updateUserProfile, deleteUserAccount } from "../services/UserManagement";

function UserProfile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserProfile();
                const data = res.data;
                setUser(data);
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                });
            } catch (err) {
                toast.error("Failed to load user data");
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            const updatedData = {}
            if (formData.firstName !== user.firstName) updatedData.firstName = formData.firstName;
            if (formData.lastName !== user.lastName) updatedData.lastName = formData.lastName;
            if (formData.email !== user.email) updatedData.email = formData.email;
            if (Object.keys(updatedData).length === 0) {
                toast("No changes made");
                return;
            }
            toast.loading("Updating profile...");
            await updateUserProfile(updatedData);
            const updated = { ...user, ...formData };
            setUser(updated);
            setIsEditing(false);
            toast.dismiss();
            toast.success("Profile updated");
        } catch (err) {
            console.log(err);
            toast.dismiss();
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            if (err.response && err.response.data && err.response.data.message) {
                toast.error("Failed to update profile: " + err.response.data.message);
            } else {
                toast.error("Failed to update profile");
            }
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete your account?");
        if (!confirmed) return;

        try {
            // const res = await deleteUserAccount();
            toast.success("Account deleted");
            localStorage.removeItem("token");
            window.location.href = "/login";
        } catch (err) {
            toast.error("Failed to delete account");
        }
    };

    const handlePasswordChange = async () => {
        if (!password || !confirmPassword) {
            toast.error("Please fill in both password fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            toast.loading("Changing password...");
            await updateUserProfile({ password: password });
            toast.dismiss();
            toast.success("Password changed successfully");

            setPassword("");
            setConfirmPassword("");
            setIsEditingPassword(false);
            setTimeout(() => {
                alert("Please log in again with your new password");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }, 500);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            toast.error("Failed to change password");
        }
    };

    if (!user) {
        return <div className="text-center text-white mt-10">Loading profile...</div>;
    }

    return (
        <div className="bg-gray-800 text-white rounded-xl shadow-md p-6 w-3/4 mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400">First Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-2 rounded"
                        />
                    ) : (
                        <p>{user.firstName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm text-gray-400">Last Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-2 rounded"
                        />
                    ) : (
                        <p>{user.lastName}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm text-gray-400">Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-2 rounded"
                        />
                    ) : (
                        <p>{user.email}</p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => { setIsEditingPassword(true) }}
                            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
                        >
                            Delete Account
                        </button>
                    </>
                )}
            </div>
            {
                isEditingPassword && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full bg-gray-700 text-white p-2 rounded mb-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            onClick={handlePasswordChange}
                            className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded mr-2"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => { setIsEditingPassword(false) }}
                            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default UserProfile;
