<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectDocument;
use Illuminate\Http\Request;

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

    public function destroy(ProjectDocument $document)
    {
        $document->delete();
        return redirect()->back();
    }
}
