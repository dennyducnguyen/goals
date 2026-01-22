import { router } from '@inertiajs/react';

export default function TaskStatusSelect({ task, className = '' }) {
    const statuses = [
        { value: 'todo', label: 'Todo', color: 'bg-gray-100 text-gray-800 border-gray-200' },
        { value: 'doing', label: 'Doing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800 border-green-200' },
        { value: 'cancel', label: 'Cancel', color: 'bg-red-100 text-red-800 border-red-200' },
    ];

    const currentStatus = statuses.find(s => s.value === task.status) || statuses[0];

    const handleChange = (e) => {
        const newStatus = e.target.value;
        router.put(route('tasks.update', task.id), {
            ...task,
            status: newStatus
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div onClick={(e) => e.stopPropagation()} className={className}>
            <select
                value={task.status}
                onChange={handleChange}
                className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-8 ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6 cursor-pointer ${currentStatus.color}`}
            >
                {statuses.map((status) => (
                    <option key={status.value} value={status.value} className="bg-white text-gray-900">
                        {status.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
