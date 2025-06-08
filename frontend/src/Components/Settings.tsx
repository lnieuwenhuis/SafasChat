function Settings() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Settings</h1>
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700 max-w-2xl w-full">
            <div className="space-y-6">
            {/* Theme Settings */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Appearance</h3>
                <div className="space-y-2">
                <label className="flex items-center">
                    <input type="radio" name="theme" className="mr-3" defaultChecked />
                    <span>Dark Mode</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="theme" className="mr-3" />
                    <span>Light Mode</span>
                </label>
                </div>
            </div>
            
            {/* Notification Settings */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Notifications</h3>
                <div className="space-y-2">
                <label className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <input type="checkbox" className="ml-3" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <input type="checkbox" className="ml-3" />
                </label>
                <label className="flex items-center justify-between">
                    <span>Sound Alerts</span>
                    <input type="checkbox" className="ml-3" defaultChecked />
                </label>
                </div>
            </div>
            
            {/* Privacy Settings */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Privacy</h3>
                <div className="space-y-2">
                <label className="flex items-center justify-between">
                    <span>Show Online Status</span>
                    <input type="checkbox" className="ml-3" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                    <span>Allow Message Previews</span>
                    <input type="checkbox" className="ml-3" defaultChecked />
                </label>
                </div>
            </div>
            
            <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                Save Changes
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                Reset to Default
                </button>
            </div>
            </div>
        </div>
        </div>
    )
}

export default Settings