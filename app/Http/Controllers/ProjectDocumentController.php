<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProjectDocumentController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:description,account,guide',
            'content' => 'nullable|string',
        ]);

        $project->documents()->create($validated);

        return redirect()->back();
    }

    public function update(Request $request, ProjectDocument $document)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:description,account,guide',
            'content' => 'nullable|string',
        ]);

        $document->update($validated);

        return redirect()->back();
    }

    public function destroy(ProjectDocument $document)
    {
        $document->delete();
        return redirect()->back();
    }

    public function toggleShare(ProjectDocument $document)
    {
        if ($document->share_token) {
            $document->update(['share_token' => null]);
        } else {
            $document->update(['share_token' => Str::random(32)]);
        }

        return redirect()->back();
    }

    public function showPublic($token)
    {
        $document = ProjectDocument::where('share_token', $token)->firstOrFail();

        return Inertia::render('Public/SharedDocument', [
            'document' => $document
        ]);
    }
}
