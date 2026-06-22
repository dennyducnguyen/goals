<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProjectFileController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'required|file|max:51200', // max 50MB
        ]);

        foreach ($request->file('files') as $uploadedFile) {
            $path = $uploadedFile->store('project-files/' . $project->id, 'public');
            
            $project->files()->create([
                'user_id' => $request->user()->id,
                'file_name' => $uploadedFile->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $uploadedFile->getMimeType(),
                'file_size' => $uploadedFile->getSize(),
                'public_token' => Str::random(32),
            ]);
        }

        return redirect()->back()->with('success', 'Files uploaded successfully');
    }

    public function destroy(ProjectFile $file)
    {
        Storage::disk('public')->delete($file->file_path);
        $file->delete();
        
        return redirect()->back();
    }

    public function togglePublic(ProjectFile $file)
    {
        $file->update(['is_public' => !$file->is_public]);
        return redirect()->back();
    }

    public function show(ProjectFile $file)
    {
        $file->load('project', 'user');
        return Inertia::render('Files/Show', [
            'file' => $file,
            'isPublicView' => false
        ]);
    }

    public function download(ProjectFile $file)
    {
        return Storage::disk('public')->download($file->file_path, $file->file_name);
    }

    public function showPublic($token)
    {
        $file = ProjectFile::where('public_token', $token)->where('is_public', true)->firstOrFail();
        $file->load('project', 'user');
        
        return Inertia::render('Files/Show', [
            'file' => $file,
            'isPublicView' => true
        ]);
    }

    public function downloadPublic($token)
    {
        $file = ProjectFile::where('public_token', $token)->where('is_public', true)->firstOrFail();
        return Storage::disk('public')->download($file->file_path, $file->file_name);
    }
}
