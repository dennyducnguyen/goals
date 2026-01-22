import { router } from '@inertiajs/react';

export default function ProjectSelectHeader({ projects, currentProjectId, isGeneral, className = '' }) {
    const handleChange = (e) => {
        const value = e.target.value;
        if (value === 'general') {
            router.get(route('tasks.index', { filter: 'independent' }));
        } else if (value === 'all') {
            router.get(route('tasks.index'));
        } else {
            router.get(route('tasks.index', { filter: 'project', project_id: value }));
        }
    };

    let selectedValue = 'all';
    if (isGeneral) selectedValue = 'general';
    else if (currentProjectId) selectedValue = currentProjectId;

    return (
        <select
            value={selectedValue}
            onChange={handleChange}
            className={`ml-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className}`}
        >
            <option value="all">All Tasks</option>
            <option value="general">General (No Project)</option>
            <optgroup label="Projects">
                {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                        {project.title}
                    </option>
                ))}
            </optgroup>
        </select>
    );
}
