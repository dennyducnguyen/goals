import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, projects }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Projects</h2>}
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-4">
                        <Link
                            href={route('projects.create')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Project
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={route('projects.show', project.id)}
                                    className="block p-6 border rounded-lg hover:bg-gray-50 transition"
                                >
                                    <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span className={`px-2 py-1 rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {project.status}
                                        </span>
                                        <span>Owner: {project.owner.name}</span>
                                    </div>
                                </Link>
                            ))}
                            {projects.length === 0 && (
                                <div className="col-span-3 text-center text-gray-500 py-10">
                                    No projects found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
