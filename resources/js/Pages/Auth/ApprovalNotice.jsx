import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ApprovalNotice({ status }) {
    const user = usePage().props.auth.user;

    return (
        <GuestLayout>
            <Head title="Approval Pending" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Your account ({user.email}) is currently pending approval by an administrator.
                You will not be able to access the dashboard until your account is activated.
            </div>

            <div className="mt-4 flex items-center justify-between">
                <Link
                    method="post"
                    href={route('logout')}
                    as="button"
                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Log Out
                </Link>
            </div>
        </GuestLayout>
    );
}
