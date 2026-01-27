import InputError from '@/Components/InputError';

import { useForm, usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MarkdownEditor from '@/Components/MarkdownEditor';
import MarkdownRenderer from '@/Components/MarkdownRenderer';

export default function Comments({ comments, modelId, type }) {
    const { auth } = usePage().props;
    const [replyingTo, setReplyingTo] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        parent_id: null,
        type: type,
    });

    const submit = (e) => {
        e.preventDefault();
        const routeName = type === 'project' ? 'projects.comments.store' : 'tasks.comments.store';

        post(route(routeName, modelId), {
            onSuccess: () => {
                reset();
                setReplyingTo(null);
            },
        });
    };

    const handleReply = (commentId) => {
        setReplyingTo(commentId);
        setData({ ...data, parent_id: commentId, content: '' }); // Clear content when opening reply
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setData({ ...data, parent_id: null, content: '' });
    };

    const deleteComment = (commentId) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(route('comments.destroy', commentId));
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Comments</h3>

            {/* New Comment Form */}
            <form onSubmit={submit} className="mb-8">
                <div className="mb-4">
                    <MarkdownEditor
                        value={data.parent_id === null ? data.content : ''} // Only show if not replying
                        onChange={(e) => setData({ ...data, content: e.target.value, parent_id: null })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px]"
                        placeholder="Add a comment..."
                        rows={4}
                    />
                    {errors.content && data.parent_id === null && (
                        <div className="text-red-500 text-sm mt-1">{errors.content}</div>
                    )}
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Post Comment
                    </button>
                </div>
            </form>

            {/* Comment List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="font-bold text-gray-900">{comment.user.name}</span>
                                <span className="text-gray-500 text-sm ml-2">
                                    {new Date(comment.created_at).toLocaleString()}
                                </span>
                            </div>
                            {(auth.user.id === comment.user_id || auth.user.role === 'admin') && (
                                <button
                                    onClick={() => deleteComment(comment.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Delete
                                </button>
                            )}
                        </div>

                        <div className="text-gray-800 mb-3">
                            <MarkdownRenderer content={comment.content} />
                        </div>

                        <button
                            onClick={() => handleReply(comment.id)}
                            className="text-indigo-600 text-sm hover:underline"
                        >
                            Reply
                        </button>

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                            <form onSubmit={submit} className="mt-4 ml-8">
                                <div className="mb-2">
                                    <MarkdownEditor
                                        value={data.content}
                                        onChange={(e) => setData({ ...data, content: e.target.value, parent_id: comment.id })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Write a reply..."
                                        rows={3}
                                    />
                                    {errors.content && (
                                        <div className="text-red-500 text-sm mt-1">{errors.content}</div>
                                    )}
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={cancelReply}
                                        className="text-gray-500 hover:text-gray-700 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 ml-8 space-y-4 border-l-2 pl-4 border-gray-200">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="bg-white p-3 rounded border">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <span className="font-bold text-sm text-gray-900">{reply.user.name}</span>
                                                <span className="text-gray-500 text-xs ml-2">
                                                    {new Date(reply.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {(auth.user.id === reply.user_id || auth.user.role === 'admin') && (
                                                <button
                                                    onClick={() => deleteComment(reply.id)}
                                                    className="text-red-500 hover:text-red-700 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <div className="text-gray-800 text-sm">
                                            <MarkdownRenderer content={reply.content} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-gray-500 text-center">No comments yet.</p>
                )}
            </div>
        </div>
    );
}
