import { router } from '@inertiajs/react';

export default function ProjectSelectHeader({ projects, currentProjectId, isGeneral, className = '' }) {
    const handleChange = (e) => {
        const value = e.target.value;
        const currentParams = new URLSearchParams(window.location.search);

        // Update or remove project_id
        if (value === 'general') {
            currentParams.set('project_id', 'independent');
        } else if (value === 'all') {
            currentParams.delete('project_id');
        } else {
            currentParams.set('project_id', value);
        }

        // Remove old 'filter' param if it exists to avoid conflicts
        currentParams.delete('filter');

        router.get(route('tasks.index'), Object.fromEntries(currentParams), {
            preserveState: true,
            preserveScroll: true
        });
    };

    let selectedValue = 'all';
    if (isGeneral) selectedValue = 'general';
    else if (currentProjectId) selectedValue = currentProjectId;
    else {
        // Handle "independent" string from URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('project_id') === 'independent') selectedValue = 'general';
    }

    return (
        <select
            value={selectedValue}
            onChange={handleChange}
            className={`ml-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className}`}
        >
            <option value="all">All Projects</option>
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
