function Profile() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">User Profile</h1>
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700 max-w-md w-full">
            <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">JD</span>
            </div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-gray-400">john.doe@example.com</p>
            </div>
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <p className="text-white">johndoe</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Member Since</label>
                <p className="text-white">January 2024</p>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                Edit Profile
            </button>
            </div>
        </div>
        </div>
    )
}

export default Profile