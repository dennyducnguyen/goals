<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('s/{token}', [\App\Http\Controllers\ProjectDocumentController::class, 'showPublic'])->name('documents.public');

Route::get('/approval-notice', function () {
    return Inertia::render('Auth/ApprovalNotice');
})->middleware(['auth'])->name('approval.notice');

Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureUserIsActive::class])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware([\App\Http\Middleware\EnsureUserIsOwner::class])->group(function () {
        Route::get('/admin/users', [\App\Http\Controllers\AdminController::class, 'index'])->name('admin.users.index');
        Route::post('/admin/users/{user}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleActivation'])->name('admin.users.toggle');
    });

    Route::resource('projects', \App\Http\Controllers\ProjectController::class);
    Route::resource('projects.documents', \App\Http\Controllers\ProjectDocumentController::class)->shallow();
    Route::post('documents/{document}/toggle-share', [\App\Http\Controllers\ProjectDocumentController::class, 'toggleShare'])->name('documents.toggle-share');
    Route::post('projects/{id}/comments', [\App\Http\Controllers\CommentController::class, 'store'])
        ->defaults('type', 'project')
        ->name('projects.comments.store');

    Route::post('tasks/{id}/comments', [\App\Http\Controllers\CommentController::class, 'store'])
        ->defaults('type', 'task')
        ->name('tasks.comments.store');
    Route::delete('comments/{comment}', [\App\Http\Controllers\CommentController::class, 'destroy'])->name('comments.destroy');
    Route::resource('tasks', \App\Http\Controllers\TaskController::class);

    // Image Upload
    Route::post('/upload-image', \App\Http\Controllers\ImageUploadController::class)->name('image.upload');

});

require __DIR__ . '/auth.php';

