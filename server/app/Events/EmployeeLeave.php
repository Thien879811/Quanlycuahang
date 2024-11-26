<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EmployeeLeave
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $leaveRequest;

    /**
     * Create a new event instance.
     *
     * @param mixed $leaveRequest
     * @return void
     */
    public function __construct($leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('employee-leave');
    }

    public function broadcastAs()
    {
        return 'leave-request';
    }

    public function broadcastWith()
    {
        return $this->leaveRequest;
    }
}
