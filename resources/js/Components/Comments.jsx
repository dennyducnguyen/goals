import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

import { useForm, usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';

function CommentItem({ comment, modelId, type }) {
    const { auth } = usePage().props;
    const [showingReplyForm, setShowingReplyForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        parent_id: comment.id,
    });

    const routeName = type === 'project' ? 'projects.comments.store' : 'tasks.comments.store';

    const submitReply = (e) => {
        e.preventDefault();
        post(route(routeName, modelId), {
            onSuccess: () => {
                reset();
                setShowingReplyForm(false);
            },
        });
    };

    return (
        <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="flex justify-between">
                <span className="font-bold text-gray-900 dark:text-gray-100">
                    {comment.user.name}
                </span>
                <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                </span>
            </div>
            <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {comment.content}
            </p>

            <div className="mt-2 flex space-x-4 text-sm">
                <button
                    onClick={() => setShowingReplyForm(!showingReplyForm)}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                >
                    Reply
                </button>
                {comment.user_id === auth.user.id && (
                    <Link
                        href={route('comments.destroy', comment.id)}
                        method="delete"
                        as="button"
                        className="text-red-600 hover:underline"
                    >
                        Delete
                    </Link>
                )}
            </div>

            {showingReplyForm && (
                <form onSubmit={submitReply} className="mt-4 pl-4 border-l-2 border-gray-300">
                    <textarea
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Write a reply..."
                        rows="2"
                    ></textarea>
                    <InputError message={errors.content} className="mt-2" />
                    <div className="mt-2 flex justify-end">
                        <PrimaryButton disabled={processing}>Reply</PrimaryButton>
                    </div>
                </form>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4 pl-8 border-l-2 border-gray-200 dark:border-gray-600">
                    {comment.replies.map((reply) => (
                        <div key={reply.id} className="rounded bg-white p-3 dark:bg-gray-800">
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                    {reply.user.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(reply.created_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {reply.content}
                            </p>
                            {reply.user_id === auth.user.id && (
                                <div className="mt-1 text-right">
                                    <Link
                                        href={route('comments.destroy', reply.id)}
                                        method="delete"
                                        as="button"
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        Delete
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Comments({ comments, modelId, type = 'project' }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        parent_id: null,
    });

    const routeName = type === 'project' ? 'projects.comments.store' : 'tasks.comments.store';

    const submit = (e) => {
        e.preventDefault();
        post(route(routeName, modelId), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {type === 'project' ? 'Project Chat' : 'Task Comments'}
            </h3>

            {/* New Comment Form */}
            <form onSubmit={submit} className="mb-8">
                <textarea
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                    placeholder="Post a comment..."
                    rows="3"
                ></textarea>
                <InputError message={errors.content} className="mt-2" />
                <div className="mt-2 flex justify-end">
                    <PrimaryButton disabled={processing}>Post Comment</PrimaryButton>
                </div>
            </form>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} modelId={modelId} type={type} />
                ))}
                {comments.length === 0 && (
                    <p className="text-center text-gray-500">No comments yet.</p>
                )}
            </div>
        </div>
    );
}


