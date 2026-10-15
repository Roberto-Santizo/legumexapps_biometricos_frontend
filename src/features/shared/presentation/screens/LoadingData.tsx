export function LoadingData() {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 animate-pulse dark:bg-gray-900 dark:border-gray-700 dark:shadow-none">
            <table className="w-full">
                <thead className="bg-slate-50 dark:bg-gray-800">
                    <tr>
                        {[...Array(5)].map((_, index) => (
                            <th key={index} className="px-6 py-4">
                                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-gray-700" />
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                    {[...Array(6)].map((_, row) => (
                        <tr key={row}>
                            <td className="px-6 py-4">
                                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-gray-700" />
                            </td>

                            <td className="px-6 py-4">
                                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-gray-700" />
                            </td>

                            <td className="px-6 py-4">
                                <div className="h-4 w-40 rounded bg-slate-200 dark:bg-gray-700" />
                            </td>

                            <td className="px-6 py-4">
                                <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-gray-700" />
                            </td>

                            <td className="px-6 py-4">
                                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-gray-700" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}