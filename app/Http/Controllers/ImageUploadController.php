<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageUploadController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // Max 10MB
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $dateFolder = date('Y-m-d');

            // Store in 'public/uploads/{date}'
            $path = $file->store("uploads/{$dateFolder}", 'public');

            // Generate URL
            $url = Storage::url($path);

            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }
}
