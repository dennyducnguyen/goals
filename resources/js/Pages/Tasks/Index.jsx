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
import MarkdownEditor from '@/Components/MarkdownEditor';

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
    const handleFilterChange = (filterType) => {
        const currentParams = new URLSearchParams(window.location.search);

        if (filterType === 'today') {
            // Toggle today filter
            if (currentParams.get('date_filter') === 'today') {
                currentParams.delete('date_filter');
            } else {
                if (currentParams.get('filter') === 'today') currentParams.delete('filter'); // clear old
                currentParams.set('date_filter', 'today');
            }
        }

        router.get(route('tasks.index'), Object.fromEntries(currentParams), {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Matrix Helpers
    const matrixTasks = {
        q1: tasks.filter(t => t.is_urgent && t.is_important), // Do First
        q2: tasks.filter(t => !t.is_urgent && t.is_important), // Schedule
        q3: tasks.filter(t => t.is_urgent && !t.is_important), // Delegate
        q4: tasks.filter(t => !t.is_urgent && !t.is_important), // Eliminate
    };

    // Tree View Logic (Pre-calculated for reuse in Desktop and Mobile views)
    const organizedTasks = (() => {
        const taskMap = {};
        const roots = [];
        // Deep copy to avoid mutating props if necessary; shallow copy task objects
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
        return flatten(roots);
    })();

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
                        <div className="flex gap-2 items-center flex-wrap">
                            {/* Assignee Filter */}
                            <select
                                value={filters.assignee_id || (filters.filter === 'my_tasks' ? auth.user.id : 'all')}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const currentParams = new URLSearchParams(window.location.search);

                                    if (value === 'all') {
                                        currentParams.delete('assignee_id');
                                    } else {
                                        currentParams.set('assignee_id', value);
                                    }

                                    // Remove old 'filter' param
                                    currentParams.delete('filter');

                                    router.get(route('tasks.index'), Object.fromEntries(currentParams), {
                                        preserveState: true,
                                        preserveScroll: true
                                    });
                                }}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="all">All Tasks</option>
                                <option value={auth.user.id}>My Tasks</option>
                                <option disabled>──────────</option>
                                {users.filter(u => u.is_active && u.id !== auth.user.id).map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>

                            <select
                                value={(filters.filter === 'today' || filters.date_filter === 'today') ? 'today' : 'all'}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const currentParams = new URLSearchParams(window.location.search);

                                    if (value === 'today') {
                                        if (currentParams.get('filter') === 'today') currentParams.delete('filter');
                                        currentParams.set('date_filter', 'today');
                                    } else {
                                        currentParams.delete('date_filter');
                                        if (currentParams.get('filter') === 'today') currentParams.delete('filter');
                                    }

                                    router.get(route('tasks.index'), Object.fromEntries(currentParams), {
                                        preserveState: true,
                                        preserveScroll: true
                                    });
                                }}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="all">All Days</option>
                                <option value="today">Today</option>
                            </select>

                            <select
                                value={filters.status || 'all'}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const currentParams = new URLSearchParams(window.location.search);

                                    if (value === 'all') {
                                        currentParams.delete('status');
                                    } else {
                                        currentParams.set('status', value);
                                    }

                                    router.get(route('tasks.index'), Object.fromEntries(currentParams), {
                                        preserveState: true,
                                        preserveScroll: true
                                    });
                                }}
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="doing">Doing</option>
                                <option value="todo">Todo</option>
                                <option value="pending">Pending</option>
                                <option value="done">Done</option>
                                <option value="cancel">Cancel</option>
                            </select>
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
                                    <TextInput id="title" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full" style={{ paddingLeft: '3px', paddingRight: '3px' }} required />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="col-span-2">
                                    <InputLabel htmlFor="description" value="Description" />
                                    <MarkdownEditor
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={4}
                                        placeholder="Mô tả task..."
                                    />
                                    <InputError message={errors.description} />
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
                                    <InputLabel htmlFor="assigned_to" value="Assignee" />
                                    <select
                                        id="assigned_to"
                                        value={data.assigned_to}
                                        onChange={e => setData('assigned_to', e.target.value)}
                                        className="w-full border-gray-300 rounded-md"
                                    >
                                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <InputLabel htmlFor="due_date" value="Due Date" />
                                    <TextInput
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={e => setData('due_date', e.target.value)}
                                        className="w-full"
                                    />
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
                                <thead className="bg-gray-50 hidden md:table-header-group">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TASK</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">General/Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 hidden md:table-row-group">
                                    {organizedTasks.map(task => (
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
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {organizedTasks.map((task) => (
                                    <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-200" onClick={() => router.visit(route('tasks.show', task.id))}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div style={{ paddingLeft: `${task.level * 15}px` }} className="font-semibold text-gray-900 text-lg flex items-center">
                                                {task.level > 0 && <span className="mr-1 text-gray-500">+</span>}
                                                {task.title}
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full uppercase font-bold ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-2 pl-2 border-l-2 border-gray-100 ml-1">
                                            {task.project ? task.project.title : 'General'} • {task.assignee.name}
                                        </div>

                                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                            <div className="text-sm text-gray-500">
                                                Due: <span className="font-medium text-gray-700">{task.due_date ? new Date(task.due_date).toLocaleDateString('en-GB') : '-'}</span>
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <TaskStatusSelect task={task} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

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
