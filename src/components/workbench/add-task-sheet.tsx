"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Search, ListFilter, LayoutGrid, ListOrdered } from "lucide-react";


interface AddTaskSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const taskHistory = [
    { transactionDate: '12/05/2025 4:45 AM', assignedTo: 'John Smith', assignedBy: 'Sarah Johnson', dueDate: '12/15/2025', status: 'In Progress', taskType: 'Review SOC 2 Report', priority: 'High' },
    { transactionDate: '12/04/2025 2:30 PM', assignedTo: 'Emily Davis', assignedBy: 'Michael Brown', dueDate: '12/12/2025', status: 'Completed', taskType: 'Analyze Vulnerability Scan', priority: 'Medium' },
    { transactionDate: '12/03/2025 9:15 AM', assignedTo: 'Robert Wilson', assignedBy: 'Lisa Anderson', dueDate: '12/10/2025', status: 'Pending', taskType: 'Check for MFA implementation', priority: 'Low' },
    { transactionDate: '12/02/2025 11:20 AM', assignedTo: 'Jennifer Taylor', assignedBy: 'David Martinez', dueDate: '12/08/2025', status: 'In Progress', taskType: 'Ransomware Exposure Review', priority: 'High' },
    { transactionDate: '12/01/2025 3:45 PM', assignedTo: 'Christopher Lee', assignedBy: 'Amanda White', dueDate: '12/06/2025', status: 'Completed', taskType: 'Documentation', priority: 'Medium' },
]

export function AddTaskSheet({ isOpen, onOpenChange }: AddTaskSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-4xl w-full sm:max-w-4xl" side="right">
        <SheetHeader>
          <SheetTitle>Add Task - CyberSec Solutions</SheetTitle>
        </SheetHeader>
        <div className="py-4">
        <Tabs defaultValue="task-history">
            <TabsList>
              <TabsTrigger value="task-details">Task Details</TabsTrigger>
              <TabsTrigger value="task-history">Task History</TabsTrigger>
            </TabsList>
            <TabsContent value="task-details">
                <p className="p-4">Task Details content goes here.</p>
            </TabsContent>
            <TabsContent value="task-history">
                <div className="flex justify-end items-center space-x-2 py-2">
                    <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><ListFilter className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><LayoutGrid className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><ListOrdered className="h-4 w-4" /></Button>
                </div>
                <div className="border rounded-md">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>TRANSACTION DATE</TableHead>
                            <TableHead>ASSIGNED TO</TableHead>
                            <TableHead>ASSIGNED BY</TableHead>
                            <TableHead>DUE DATE</TableHead>
                            <TableHead>STATUS</TableHead>
                            <TableHead>TASK TYPE</TableHead>
                            <TableHead>PRIORITY</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {taskHistory.map((task, index) => (
                            <TableRow key={index}>
                                <TableCell>{task.transactionDate}</TableCell>
                                <TableCell>{task.assignedTo}</TableCell>
                                <TableCell>{task.assignedBy}</TableCell>
                                <TableCell>{task.dueDate}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>{task.taskType}</TableCell>
                                <TableCell>{task.priority}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
                <div className="flex justify-end items-center space-x-4 text-sm mt-4">
                    <span>Rows per page</span>
                    <Select defaultValue="10">
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>0-0 of 0</span>
                    <div className="flex space-x-1">
                        <Button variant="ghost" size="icon">&lt;</Button>
                        <Button variant="ghost" size="icon">&gt;</Button>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
        </div>
        <SheetFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Add Task</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
