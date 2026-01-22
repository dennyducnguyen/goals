<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'parent_id',
        'assigned_to',
        'created_by',
        'due_date',
        'priority',
        'status',
        'is_urgent',
        'is_important'
    ];

    protected $casts = [
        'due_date' => 'date',
        'is_urgent' => 'boolean',
        'is_important' => 'boolean',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeMyTasks($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', now());
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function parent()
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Task::class, 'parent_id');
    }
}
