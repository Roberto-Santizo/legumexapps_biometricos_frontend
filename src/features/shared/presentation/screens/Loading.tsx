export function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white bg-linear-to-br from-slate-900 via-blue-900 to-slate-800">
            <div className="relative">
                <div className="absolute inset-0 h-24 w-24 rounded-full border border-gray-200 dark:border-gray-600" />

                <div className="absolute inset-0 h-24 w-24 rounded-full border-2 border-transparent border-t-green-600 animate-spin" />

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                    <img
                        src="https://legumexappsapi-storage.s3.us-east-1.amazonaws.com/resources/LOGO_LX_V2.png"
                        alt="Logo"
                        className="h-14 w-14 object-contain"
                    />
                </div>
            </div>
        </div>
    );
}