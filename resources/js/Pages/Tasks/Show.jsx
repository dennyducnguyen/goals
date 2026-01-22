import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Comments from '@/Components/Comments';
import TaskStatusSelect from '@/Components/TaskStatusSelect';
import TaskPrioritySelect from '@/Components/TaskPrioritySelect';
import ProjectSelectHeader from '@/Components/ProjectSelectHeader';
import InputError from '@/Components/InputError';

import { useState } from 'react';

export default function Show({ auth, task, projects, users, potential_parents }) {
    const { errors } = usePage().props;
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [description, setDescription] = useState(task.description || '');

    const saveDescription = () => {
        router.put(route('tasks.update', task.id), {
            ...task,
            description: description
        }, {
            preserveScroll: true,
            onSuccess: () => setIsEditingDesc(false)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Task: {task.title}</h2>
                    <ProjectSelectHeader
                        projects={projects}
                        currentProjectId={task.project_id}
                        isGeneral={!task.project_id}
                    />
                </div>
            }
        >
            <Head title={task.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Task Info */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <Link
                                    href={route('tasks.index')}
                                    className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
                                >
                                    &larr; Back to Tasks
                                </Link>

                                {/* Editable Title */}
                                <div className="mb-4 group">
                                    <div className="flex flex-col gap-1">
                                        <input
                                            type="text"
                                            defaultValue={task.title}
                                            onBlur={(e) => {
                                                const val = e.target.value.trim();
                                                if (val === '') {
                                                    e.target.value = task.title; // Revert to original
                                                    return;
                                                }
                                                if (val !== task.title) {
                                                    router.put(route('tasks.update', task.id), { ...task, title: val }, { preserveScroll: true });
                                                }
                                            }}
                                            className={`text-2xl font-bold border-transparent hover:border-gray-300 focus:border-indigo-500 rounded px-2 -ml-2 w-full bg-transparent focus:bg-white transition-colors ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        />
                                        {errors.title && <div className="text-sm text-red-600 px-2">{errors.title}</div>}
                                    </div>
                                </div>

                                <div className="mb-2 flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-900">Description</h4>
                                    {!isEditingDesc && (
                                        <button
                                            onClick={() => {
                                                setDescription(task.description || '');
                                                setIsEditingDesc(true);
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {isEditingDesc ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[150px]"
                                            placeholder="Enter task description..."
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={saveDescription}
                                                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditingDesc(false)}
                                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap border p-4 rounded bg-gray-50 min-h-[100px]">
                                        {task.description || <span className="italic text-gray-400">No description provided.</span>}
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Project</span>
                                    <select
                                        value={task.project_id || ''}
                                        onChange={(e) => router.put(route('tasks.update', task.id), { ...task, project_id: e.target.value || null }, { preserveScroll: true, preserveState: true })}
                                        className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">General (No Project)</option>
                                        {projects.map(project => (
                                            <option key={project.id} value={project.id}>{project.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Parent Task</span>
                                    <select
                                        value={task.parent_id || ''}
                                        onChange={(e) => router.put(route('tasks.update', task.id), { ...task, parent_id: e.target.value || null }, { preserveScroll: true, preserveState: true })}
                                        className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">None</option>
                                        {potential_parents.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Assignee</span>
                                    <select
                                        value={task.assigned_to}
                                        onChange={(e) => router.put(route('tasks.update', task.id), { ...task, assigned_to: e.target.value }, { preserveScroll: true, preserveState: true })}
                                        className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Status</span>
                                    <TaskStatusSelect task={task} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Priority</span>
                                    <TaskPrioritySelect task={task} />
                                </div>
                                <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={task.is_urgent}
                                            onChange={(e) => router.put(route('tasks.update', task.id), { ...task, is_urgent: e.target.checked }, { preserveScroll: true, preserveState: true })}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Urgent</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={task.is_important}
                                            onChange={(e) => router.put(route('tasks.update', task.id), { ...task, is_important: e.target.checked }, { preserveScroll: true, preserveState: true })}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Important</span>
                                    </label>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-500 uppercase">DUE DATE:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString('en-GB') : 'Set Date'}
                                        </span>
                                    </div>
                                    <input
                                        type="date"
                                        value={task.due_date || ''}
                                        onChange={(e) => router.put(route('tasks.update', task.id), { ...task, due_date: e.target.value }, { preserveScroll: true, preserveState: true })}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <Comments comments={task.comments || []} modelId={task.id} type="task" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
