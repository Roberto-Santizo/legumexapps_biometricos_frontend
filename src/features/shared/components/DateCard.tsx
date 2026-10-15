import { Calendar } from "lucide-react";

interface DateCardProps {
  title: string;
  date: string;
}

export function DateCard({
  title,
  date,
}: DateCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-5 dark:bg-gray-800">
      <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-gray-900 dark:shadow-none">
        <Calendar className="text-gray-600 dark:text-gray-400" size={20} />
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="font-semibold text-gray-900 dark:text-gray-100">{date}</p>
      </div>
    </div>
  );
}