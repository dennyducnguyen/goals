<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectDocument extends Model
{
    protected $fillable = ['project_id', 'title', 'type', 'content', 'share_token'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
