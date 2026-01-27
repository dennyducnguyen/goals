<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function show(Task $task)
    {
        $task->load([
            'project',
            'assignee',
            'comments' => function ($query) {
                $query->whereNull('parent_id')
                    ->with(['user', 'replies.user'])
                    ->latest();
            }
        ]);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
            'projects' => Project::all(),
            'users' => User::where('is_active', true)->get(),
            'potential_parents' => Task::where('id', '!=', $task->id)->select('id', 'title', 'project_id')->get(),
        ]);
    }

    public function index(Request $request)
    {
        $query = Task::with(['project', 'assignee']);

        // Filter by Project
        if ($request->has('project_id')) {
            if ($request->project_id === 'independent') {
                $query->whereNull('project_id');
            } elseif ($request->project_id !== 'all') {
                $query->where('project_id', $request->project_id);
            }
        } elseif ($request->filter === 'independent') {
            // Keep backward compatibility for 'filter=independent' if needed, or just rely on project_id=independent
            $query->whereNull('project_id');
        }

        // Filter by Assignee
        if ($request->has('assignee_id')) {
            if ($request->assignee_id !== 'all') {
                $query->where('assigned_to', $request->assignee_id);
            }
        } elseif ($request->filter === 'my_tasks') {
            // Keep backward compatibility
            $query->myTasks(Auth::id());
        }

        // Filter by Date
        if ($request->date_filter === 'today' || $request->filter === 'today') {
            $query->whereDate('due_date', now());
        }

        // Filter by Status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $tasks = $query->latest()->get();
        $projects = Project::all();
        $users = User::where('is_active', true)->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'filters' => $request->all(), // Pass all params back for state retention
            'projects' => $projects,
            'users' => $users,
            'potential_parents' => Task::select('id', 'title', 'project_id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
            'due_date' => 'nullable|date',
            'priority' => 'required|string|in:low,normal,high',
            'is_urgent' => 'boolean',
            'is_important' => 'boolean',
            'parent_id' => 'nullable|exists:tasks,id',
        ]);

        $validated['created_by'] = Auth::id();

        // Enforce Child Task Project = Parent Task Project
        if (!empty($validated['parent_id'])) {
            $parent = Task::find($validated['parent_id']);
            if ($parent) {
                $validated['project_id'] = $parent->project_id;
            }
        }

        Task::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
            'due_date' => 'nullable|date',
            'status' => 'required|string|in:todo,doing,done,pending,cancel',
            'priority' => 'required|string|in:low,normal,high',
            'is_urgent' => 'boolean',
            'is_important' => 'boolean',
            'parent_id' => 'nullable|exists:tasks,id|different:id',
        ]);

        $task->update($validated);

        return redirect()->back();
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->back();
    }
}
