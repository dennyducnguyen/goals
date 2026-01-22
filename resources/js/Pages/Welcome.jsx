import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to IM GROUP Goals" />
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                <div className="w-full max-w-2xl px-6 lg:max-w-7xl">
                    <header className="flex justify-end py-6">
                        <nav className="-mx-3 flex flex-1 justify-end">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="mt-10 flex flex-col items-center justify-center text-center">
                        <div className="mb-8 p-4">
                            <img
                                src="https://id.imgroup.vn/public/modules/account/images/logo_imgroup.png"
                                alt="IM GROUP Logo"
                                className="h-24 w-auto mx-auto object-contain"
                            />
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
                            Internal Project & Task Management
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                            Trang quản lý Projects và Tasks của nội bộ IM GROUP. <br />
                            Hệ thống giúp theo dõi tiến độ, quản lý công việc và tối ưu hóa hiệu suất làm việc của đội ngũ.
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md bg-red-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Truy cập Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded-md bg-red-600 px-8 py-4 text-xl font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Đăng nhập ngay
                                </Link>
                            )}
                        </div>
                    </main>

                    <footer className="py-16 text-center text-sm text-gray-500 mt-20">
                        &copy; 2026 IM GROUP. All rights reserved.
                    </footer>
                </div>
            </div>
        </>
    );
}
