"use client";

import * as React from "react";
import { Submission, Task } from "@/lib/types";
import { tasks as allTasks } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, ExternalLink, ChevronsUpDown, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SubmissionDetailsProps {
  submission: Submission;
  onBack: () => void;
}

const InfoCard = ({ title, value }: { title: string, value: string | React.ReactNode }) => (
    <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="font-semibold">{value}</div>
    </div>
);

const tagColors: { [key: string]: string } = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
  };

export function SubmissionDetails({ submission, onBack }: SubmissionDetailsProps) {
    const [activeTab, setActiveTab] = React.useState("Task");
    const [tasks, setTasks] = React.useState<Task[]>([]);

    React.useEffect(() => {
        setTasks(allTasks.filter(t => t.submissionId === submission.id));
    }, [submission.id]);


  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="text-sm text-muted-foreground">
                    Back <span className="text-primary">Submission number | {submission.id}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">Guidewire <ExternalLink className="h-4 w-4 ml-2" /></Button>
                <Button variant="outline">ImageRight <ExternalLink className="h-4 w-4 ml-2" /></Button>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex pt-6">
            {/* Left Actions Panel */}
            <div className="w-48 pr-6">
                <Button className="w-full justify-between bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                    Actions <ChevronsUpDown className="h-4 w-4" />
                </Button>
            </div>

            {/* Right Details Panel */}
            <div className="flex-1">
                {/* Submission Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <InfoCard title="Submission #" value={submission.id} />
                    <InfoCard title="MFA Enforced" value={submission.mfaEnforced} />
                    <InfoCard title="GWPC Status" value={<Badge variant={submission.status === 'Booked' ? 'success' : 'default'}>{submission.status}</Badge>} />
                    <div></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Account</p>
                        <p className="font-semibold text-lg">A215743</p>
                        <p className="font-semibold">{submission.insuredName}</p>
                        <p className="text-sm">Karl, EIB5</p>
                        <p className="text-sm">Krypto IA 45654 United States</p>
                    </div>
                    <InfoCard title="Prior Year Submission" value="-" />
                    <InfoCard title="Policy Number / Policy Source" value="531881K / PolicyCenter" />
                </div>
                
                {/* Tabs */}
                <div className="mt-8">
                    <div className="flex border-b">
                        <button 
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'Submission' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                            onClick={() => setActiveTab('Submission')}
                        >
                            Submission
                        </button>
                        <button 
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'Task' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                            onClick={() => setActiveTab('Task')}
                        >
                            Task
                        </button>
                    </div>

                    {/* Task Tab Content */}
                    {activeTab === 'Task' && (
                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Task</h3>
                                <Button>Add Task</Button>
                            </div>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader className="bg-muted">
                                        <TableRow>
                                            <TableHead>TASK TYPE</TableHead>
                                            <TableHead>NOTE</TableHead>
                                            <TableHead>CREATED DATE</TableHead>
                                            <TableHead>DUE DATE</TableHead>
                                            <TableHead>STATUS</TableHead>
                                            <TableHead>TAGS</TableHead>
                                            <TableHead>ASSIGN TO</TableHead>
                                            <TableHead>PRIORITY</TableHead>
                                            <TableHead>ACTION</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="font-semibold bg-muted">
                                            <TableCell colSpan={9}><ChevronDown className="inline h-4 w-4 mr-2"/>To Do</TableCell>
                                        </TableRow>
                                        {tasks.filter(t => t.status === 'To Do').map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell>{task.taskType}</TableCell>
                                                <TableCell>{task.note}</TableCell>
                                                <TableCell>{task.createdDate}</TableCell>
                                                <TableCell>{task.dueDate}</TableCell>
                                                <TableCell>{task.status}</TableCell>
                                                <TableCell>{task.tags && <div className={`h-3 w-3 rounded-full ${tagColors[task.tags] || ''}`}></div>}</TableCell>
                                                <TableCell>{task.assignTo}</TableCell>
                                                <TableCell>{task.priority}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                         <TableRow className="font-semibold bg-muted">
                                            <TableCell colSpan={9}><ChevronDown className="inline h-4 w-4 mr-2"/>Done</TableCell>
                                        </TableRow>
                                        {tasks.filter(t => t.status === 'Done').map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell>{task.taskType}</TableCell>
                                                <TableCell>{task.note}</TableCell>
                                                <TableCell>{task.createdDate}</TableCell>
                                                <TableCell>{task.dueDate}</TableCell>
                                                <TableCell>{task.status}</TableCell>
                                                <TableCell>{task.tags && <div className={`h-3 w-3 rounded-full ${tagColors[task.tags] || ''}`}></div>}</TableCell>
                                                <TableCell>{task.assignTo}</TableCell>
                                                <TableCell>{task.priority}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                     {activeTab === 'Submission' && (
                        <div className="pt-4 text-center text-muted-foreground">
                            Submission details would be displayed here.
                        </div>
                     )}
                </div>
            </div>
        </div>
    </div>
  );
}
