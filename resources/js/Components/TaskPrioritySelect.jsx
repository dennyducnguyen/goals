import { router } from '@inertiajs/react';

export default function TaskPrioritySelect({ task, className = '' }) {
    const priorities = [
        { value: 'low', label: 'Low', color: 'text-gray-600' },
        { value: 'normal', label: 'Normal', color: 'text-blue-600' },
        { value: 'high', label: 'High', color: 'text-red-600' },
    ];

    const currentPriority = priorities.find(p => p.value === task.priority) || priorities[1];

    const handleChange = (e) => {
        const newPriority = e.target.value;
        router.put(route('tasks.update', task.id), {
            ...task,
            priority: newPriority
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div onClick={(e) => e.stopPropagation()} className={className}>
            <select
                value={task.priority}
                onChange={handleChange}
                className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-8 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6 cursor-pointer font-semibold ${currentPriority.color}`}
            >
                {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value} className="text-gray-900">
                        {priority.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
