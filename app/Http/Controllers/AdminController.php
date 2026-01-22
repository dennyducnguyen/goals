<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $users = \App\Models\User::all();
        return \Inertia\Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    public function toggleActivation(\App\Models\User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();

        return redirect()->back();
    }
}
