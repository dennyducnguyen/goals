<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Mail\DailyDigest;
use Illuminate\Support\Facades\Mail;

class SendDailyDigest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-daily-digest';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily email digest to users with tasks due today';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::where('is_active', true)->get();

        foreach ($users as $user) {
            $tasks = \App\Models\Task::where('assigned_to', $user->id)
                ->whereDate('due_date', now())
                ->where('status', '!=', 'done')
                ->get();

            if ($tasks->count() > 0) {
                Mail::to($user)->send(new DailyDigest($tasks));
                $this->info("Emails sent to {$user->email}");
            }
        }

        $this->info('Daily digest process completed.');
    }
}
