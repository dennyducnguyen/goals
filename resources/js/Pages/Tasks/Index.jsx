import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import TaskStatusSelect from '@/Components/TaskStatusSelect';
import ProjectSelectHeader from '@/Components/ProjectSelectHeader';

export default function Index({ auth, tasks, filters, projects, users, potential_parents }) {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'matrix'
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Create Task Form
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        project_id: '',
        parent_id: '',
        assigned_to: auth.user.id,
        due_date: formattedDate,
        priority: 'normal',
        is_urgent: false,
        is_important: false,
    });

    const submitTask = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => {
                reset();
                setShowCreateForm(false);
            },
        });
    };

    // Filter Logic
    const handleFilterChange = (filter) => {
        router.get(route('tasks.index'), { filter }, { preserveState: true });
    };

    // Matrix Helpers
    const matrixTasks = {
        q1: tasks.filter(t => t.is_urgent && t.is_important), // Do First
        q2: tasks.filter(t => !t.is_urgent && t.is_important), // Schedule
        q3: tasks.filter(t => t.is_urgent && !t.is_important), // Delegate
        q4: tasks.filter(t => !t.is_urgent && !t.is_important), // Eliminate
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tasks</h2>
                    <ProjectSelectHeader
                        projects={projects}
                        currentProjectId={filters.project_id}
                        isGeneral={filters.filter === 'independent'}
                    />
                </div>
            }
        >
            <Head title="Tasks" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex gap-2">
                            <button onClick={() => handleFilterChange('my_tasks')} className={`px-4 py-2 rounded ${filters.filter === 'my_tasks' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>My Tasks</button>
                            <button onClick={() => handleFilterChange('today')} className={`px-4 py-2 rounded ${filters.filter === 'today' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>Today</button>
                            <button onClick={() => router.get(route('tasks.index'))} className={`px-4 py-2 rounded ${!filters.filter ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>All</button>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>List View</button>
                            <button onClick={() => setViewMode('matrix')} className={`px-4 py-2 rounded ${viewMode === 'matrix' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>Eisenhower Matrix</button>
                            <PrimaryButton className="!bg-orange-500 hover:!bg-orange-600" onClick={() => setShowCreateForm(!showCreateForm)}>{showCreateForm ? 'Cancel' : 'New Task'}</PrimaryButton>
                        </div>
                    </div>

                    {/* Create Form */}
                    {showCreateForm && (
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <form onSubmit={submitTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <InputLabel htmlFor="title" value="Title" />
                                    <TextInput id="title" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full" required />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="col-span-2">
                                    <InputLabel htmlFor="description" value="Description" />
                                    <TextInput id="description" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="parent_id" value="Parent Task" />
                                    <select
                                        id="parent_id"
                                        value={data.parent_id}
                                        onChange={e => {
                                            const pid = e.target.value;
                                            const parent = potential_parents.find(p => p.id == pid);
                                            setData(prev => ({
                                                ...prev,
                                                parent_id: pid,
                                                project_id: parent ? (parent.project_id || '') : prev.project_id
                                            }));
                                        }}
                                        className="w-full border-gray-300 rounded-md"
                                    >
                                        <option value="">None</option>
                                        {potential_parents.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel htmlFor="project_id" value="Project" />
                                    <select
                                        id="project_id"
                                        value={data.project_id}
                                        onChange={e => setData('project_id', e.target.value)}
                                        className="w-full border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                                        disabled={!!data.parent_id}
                                    >
                                        <option value="">None (General)</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel htmlFor="priority" value="Priority" />
                                    <select id="priority" value={data.priority} onChange={e => setData('priority', e.target.value)} className="w-full border-gray-300 rounded-md">
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <label className="flex items-center">
                                        <Checkbox checked={data.is_urgent} onChange={e => setData('is_urgent', e.target.checked)} />
                                        <span className="ml-2 text-sm text-gray-600">Urgent</span>
                                    </label>
                                    <label className="flex items-center">
                                        <Checkbox checked={data.is_important} onChange={e => setData('is_important', e.target.checked)} />
                                        <span className="ml-2 text-sm text-gray-600">Important</span>
                                    </label>
                                </div>
                                <div className="col-span-2 text-right">
                                    <PrimaryButton disabled={processing}>Save Task</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {viewMode === 'list' ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TASK</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">General/Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Tree View Logic */}
                                    {(() => {
                                        const taskMap = {};
                                        const roots = [];
                                        tasks.forEach(t => taskMap[t.id] = { ...t, children: [] });
                                        tasks.forEach(t => {
                                            if (t.parent_id && taskMap[t.parent_id]) {
                                                taskMap[t.parent_id].children.push(taskMap[t.id]);
                                            } else {
                                                roots.push(taskMap[t.id]);
                                            }
                                        });
                                        const flatten = (nodes, level = 0) => {
                                            let result = [];
                                            nodes.forEach(n => {
                                                result.push({ ...n, level });
                                                if (n.children.length > 0) result = result.concat(flatten(n.children, level + 1));
                                            });
                                            return result;
                                        };
                                        const organizedTasks = flatten(roots);

                                        return organizedTasks.map(task => (
                                            <tr key={task.id} onClick={() => router.visit(route('tasks.show', task.id))} className="cursor-pointer hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    <div style={{ paddingLeft: `${task.level * 20}px` }} className="flex items-center">
                                                        {task.level > 0 && <span className="mr-1 text-gray-500 font-bold">+</span>}
                                                        <div>{task.title}</div>
                                                    </div>
                                                    <div className="text-xs text-gray-400 italic mt-1" style={{ paddingLeft: `${task.level * 20}px` }}>
                                                        created {new Date(task.created_at).toLocaleDateString('en-GB')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">{task.project ? task.project.title : 'General'}</td>
                                                <td className="px-6 py-4">{task.assignee.name}</td>
                                                <td className="px-6 py-4">
                                                    {task.due_date ? new Date(task.due_date).toLocaleDateString('en-GB') : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <TaskStatusSelect task={task} />
                                                </td>
                                                <td className="px-6 py-4 capitalize">{task.priority}</td>
                                            </tr>
                                        ));
                                    })()}
                                </tbody>
                            </table>
                            {tasks.length === 0 && <p className="text-center text-gray-500 mt-4">No tasks found.</p>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            <div className="bg-red-50 p-4 rounded border border-red-200">
                                <h3 className="font-bold text-red-800 mb-2">Urgent & Important (Do First)</h3>
                                <ul className="space-y-2">
                                    {matrixTasks.q1.map(t => <li key={t.id} className="bg-white p-2 rounded shadow text-sm">{t.title} <span className="text-xs text-gray-500 ml-2">Due: {t.due_date}</span></li>)}
                                </ul>
                            </div>
                            <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-2">Not Urgent & Important (Schedule)</h3>
                                <ul className="space-y-2">
                                    {matrixTasks.q2.map(t => <li key={t.id} className="bg-white p-2 rounded shadow text-sm">{t.title} <span className="text-xs text-gray-500 ml-2">Due: {t.due_date}</span></li>)}
                                </ul>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                                <h3 className="font-bold text-yellow-800 mb-2">Urgent & Not Important (Delegate)</h3>
                                <ul className="space-y-2">
                                    {matrixTasks.q3.map(t => <li key={t.id} className="bg-white p-2 rounded shadow text-sm">{t.title} <span className="text-xs text-gray-500 ml-2">Assignee: {t.assignee.name}</span></li>)}
                                </ul>
                            </div>
                            <div className="bg-green-50 p-4 rounded border border-green-200">
                                <h3 className="font-bold text-green-800 mb-2">Not Urgent & Not Important (Eliminate)</h3>
                                <ul className="space-y-2">
                                    {matrixTasks.q4.map(t => <li key={t.id} className="bg-white p-2 rounded shadow text-sm">{t.title}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </AuthenticatedLayout >
    );
}
