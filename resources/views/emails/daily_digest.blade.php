<!DOCTYPE html>
<html>

<head>
    <title>Daily Task Digest</title>
</head>

<body style="font-family: Arial, sans-serif;">
    <h2>Your tasks for today ({{ now()->format('Y-m-d') }})</h2>

    @if(count($tasks) > 0)
        <ul>
            @foreach($tasks as $task)
                <li style="margin-bottom: 10px;">
                    <strong>{{ $task->title }}</strong>
                    @if($task->project)
                        <br><span style="color: gray;">Project: {{ $task->project->title }}</span>
                    @endif
                    <br><span style="font-size: 0.9em; color: {{ $task->is_urgent ? 'red' : 'black' }}">
                        {{ $task->is_urgent ? 'Urgent' : 'Normal' }} Priority
                    </span>
                </li>
            @endforeach
        </ul>
        <p>Log in to view more details and update status.</p>
    @else
        <p>You have no tasks due today. Great job!</p>
    @endif
</body>

</html>