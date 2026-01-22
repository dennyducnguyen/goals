import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Comments from '@/Components/Comments';

export default function Show({ auth, project }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'description',
        content: '',
    });

    const [activeTab, setActiveTab] = useState('tasks');
    const [showDocForm, setShowDocForm] = useState(false);
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [editData, setEditData] = useState({
        title: project.title,
        description: project.description
    });

    const submitDoc = (e) => {
        e.preventDefault();
        post(route('projects.documents.store', project.id), {
            onSuccess: () => {
                reset();
                setShowDocForm(false);
            },
        });
    };

    const saveProjectDetails = () => {
        router.put(route('projects.update', project.id), {
            ...project,
            title: editData.title,
            description: editData.description
        }, {
            preserveScroll: true,
            onSuccess: () => setIsEditingProject(false)
        });
    };

    const tabs = [
        { id: 'tasks', label: 'Project Tasks' },
        { id: 'documents', label: 'Documents & Information' },
        { id: 'chats', label: 'Chats' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Project: {project.title}</h2>}
        >
            <Head title={project.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Project Details */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold">Project Details</h3>
                            {!isEditingProject && (
                                <button
                                    onClick={() => {
                                        setEditData({ title: project.title, description: project.description });
                                        setIsEditingProject(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                >
                                    Edit Project
                                </button>
                            )}
                        </div>

                        {isEditingProject ? (
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="edit_title" value="Title" />
                                    <TextInput
                                        id="edit_title"
                                        value={editData.title}
                                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="edit_description" value="Description" />
                                    <textarea
                                        id="edit_description"
                                        value={editData.description}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm min-h-[100px]"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsEditingProject(false)}
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveProjectDetails}
                                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-xl mb-2">{project.title}</h4>
                                    <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
                                </div>
                                <div className="text-sm text-gray-500 min-w-[150px] text-right">
                                    <div className="mb-1"><span className="font-semibold">Status:</span> {project.status}</div>
                                    <div><span className="font-semibold">Owner:</span> {project.owner.name}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Custom Tabs */}
                    <div className="w-full">
                        {/* Tab Headers */}
                        <div className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 dark:bg-gray-700/50 mb-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${activeTab === tab.id
                                        ? 'bg-white text-blue-700 shadow dark:bg-gray-800 dark:text-blue-400'
                                        : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-900 dark:text-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Contents */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            {activeTab === 'tasks' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Project Tasks</h3>
                                        <Link
                                            href={route('tasks.index', { filter: 'project', project_id: project.id })}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                        >
                                            Manage Tasks
                                        </Link>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {project.tasks && project.tasks.map(task => (
                                                    <tr key={task.id}>
                                                        <td className="px-6 py-4">{task.title}</td>
                                                        <td className="px-6 py-4">{task.assignee ? task.assignee.name : 'Unassigned'}</td>
                                                        <td className="px-6 py-4">
                                                            {task.due_date ? new Date(task.due_date).toLocaleDateString('en-GB') : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 capitalize">{task.status.replace('_', ' ')}</td>
                                                    </tr>
                                                ))}
                                                {(!project.tasks || project.tasks.length === 0) && (
                                                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No tasks found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Documents & Information</h3>
                                        <button
                                            onClick={() => setShowDocForm(!showDocForm)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                        >
                                            {showDocForm ? 'Cancel' : '+ Add Document'}
                                        </button>
                                    </div>

                                    {showDocForm && (
                                        <form onSubmit={submitDoc} className="mb-6 bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel htmlFor="doc_title" value="Title" />
                                                    <TextInput
                                                        id="doc_title"
                                                        value={data.title}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData('title', e.target.value)}
                                                        required
                                                    />
                                                    <InputError message={errors.title} className="mt-2" />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="doc_type" value="Type" />
                                                    <select
                                                        id="doc_type"
                                                        value={data.type}
                                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                        onChange={(e) => setData('type', e.target.value)}
                                                    >
                                                        <option value="description">Description</option>
                                                        <option value="account">Account/Credentials</option>
                                                        <option value="guide">Guide/Deployment</option>
                                                    </select>
                                                    <InputError message={errors.type} className="mt-2" />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <InputLabel htmlFor="doc_content" value="Content / Details" />
                                                <textarea
                                                    id="doc_content"
                                                    value={data.content}
                                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                    rows="3"
                                                    onChange={(e) => setData('content', e.target.value)}
                                                ></textarea>
                                                <InputError message={errors.content} className="mt-2" />
                                            </div>
                                            <div className="mt-4 text-right">
                                                <PrimaryButton disabled={processing}>Save Document</PrimaryButton>
                                            </div>
                                        </form>
                                    )}

                                    <div className="grid grid-cols-1 gap-4">
                                        {project.documents && project.documents.map((doc) => (
                                            <div key={doc.id} className="border p-4 rounded-lg">
                                                <div className="flex justify-between">
                                                    <h4 className="font-bold">{doc.title} <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2">{doc.type}</span></h4>
                                                    <Link
                                                        method="delete"
                                                        href={route('documents.destroy', doc.id)}
                                                        as="button"
                                                        className="text-red-600 text-sm hover:underline"
                                                    >
                                                        Delete
                                                    </Link>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                                    {doc.content}
                                                </div>
                                            </div>
                                        ))}
                                        {(!project.documents || project.documents.length === 0) && (
                                            <p className="text-gray-500 text-sm">No documents added yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'chats' && (
                                <div>
                                    <Comments comments={project.comments || []} modelId={project.id} type="project" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
