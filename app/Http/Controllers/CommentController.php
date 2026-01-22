<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $type = $request->route('type');

        $model = null;
        if ($type === 'project') {
            $model = Project::findOrFail($id);
        } elseif ($type === 'task') {
            $model = \App\Models\Task::findOrFail($id);
        } else {
            abort(404);
        }

        $model->comments()->create([
            'content' => $validated['content'],
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment): RedirectResponse
    {
        // Allow author or project owner (if we had access to project here, but simpler to just allow author for now)
        if ($comment->user_id !== Auth::id()) {
            abort(403);
        }

        $comment->delete();

        return redirect()->back();
    }
}
