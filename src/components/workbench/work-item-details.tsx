"use client";

import * as React from "react";
import { WorkItem, Submission } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  ChevronsUpDown,
  Check,
  Circle,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface WorkItemDetailsProps {
  workItem: WorkItem;
  submission: Submission;
  onBack: () => void;
}

const InfoCard = ({
  title,
  value,
}: {
  title: string;
  value: string | React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const SideNavItem = ({ icon, label, status, isActive = false, isSubItem = false, children }: any) => (
    <div className={isSubItem ? "pl-6" : ""}>
        <div className={`flex items-center p-2 rounded-md cursor-pointer ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}>
            {status === 'completed' && <Check className="h-4 w-4 text-green-500 mr-2" />}
            {status === 'inprogress' && <Circle className="h-4 w-4 text-primary mr-2" />}
            {status === 'pending' && <div className="h-4 w-4 border-2 border-muted-foreground rounded-full mr-2" />}
            <span className="flex-1 text-sm">{label}</span>
        </div>
        {children}
    </div>
);


export function WorkItemDetails({
  workItem,
  submission,
  onBack,
}: WorkItemDetailsProps) {
  const [activeTab, setActiveTab] = React.useState("Submission");

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>Back</span>
            <span className="text-primary">| Work Item #{workItem.id} | {submission.id} | {submission.insuredName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            Guidewire <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline">
            ImageRight <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Actions Panel */}
        <div className="w-64 p-4 border-r">
            <Button className="w-full justify-start bg-secondary hover:bg-secondary/80 text-secondary-foreground mb-4">
                Actions
            </Button>
            <div className="space-y-1">
                <SideNavItem icon="summary" label="Summary" status="completed" isActive={true} />
                <SideNavItem icon="sov" label="SOV Management" status="completed" />
                <SideNavItem icon="exposure" label="Exposure Evaluation" status="completed" />
                <SideNavItem icon="policy" label="Policy Terms" status="inprogress">
                    <div className="pt-1">
                        <SideNavItem label="Modeling" status="pending" isSubItem={true} />
                        <SideNavItem label="Pricing" status="pending" isSubItem={true} />
                        <SideNavItem label="Pricing Summary" status="pending" isSubItem={true} />
                    </div>
                </SideNavItem>
                <SideNavItem icon="gwpc" label="GWPC Sync" status="pending" />
                <SideNavItem icon="narrative" label="UW Narrative" status="pending" />
            </div>
        </div>

        {/* Right Details Panel */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Work Item #{workItem.id}</h2>
              <p className="text-muted-foreground">Owner: {workItem.owner}</p>
            </div>
            <Button variant="outline">Reassign</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p>{workItem.type}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <Select defaultValue={workItem.priority}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">GWPC Status</p>
                <p>{workItem.gwpcStatus}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Status</p>
                 <Select defaultValue={workItem.status}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="WIP">WIP</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                         <SelectItem value="To Do">To Do</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                <div>
                    <Checkbox id="indicated" checked={workItem.indicated} />
                    <label htmlFor="indicated" className="ml-2 text-sm font-medium">Indicated?</label>
                </div>
                 <div>
                    <Checkbox id="automationStatus" checked={workItem.automationStatus !== 'Not Applicable'} />
                    <label htmlFor="automationStatus" className="ml-2 text-sm font-medium">Automation Status</label>
                    <p className="text-sm text-muted-foreground ml-6">{workItem.automationStatus}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Exposure Status</p>
                    <p>{workItem.exposureStatus}</p>
                </div>
           </div>


          {/* Tabs */}
          <div className="mt-8">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "Submission"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("Submission")}
              >
                Submission
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "History"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("History")}
              >
                History
              </button>
            </div>
            
            {activeTab === 'Submission' && (
                <div className="bg-muted/50 p-4 mt-4 rounded-md border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">{submission.id} | {submission.insuredName}</h3>
                        <Button variant="ghost"><Plus className="h-4 w-4 mr-2" />Action</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Insured Name</p>
                            <p>{submission.insuredName}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Country</p>
                            <p>United States</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Effective Date</p>
                            <p>{submission.effectiveDate}</p>
                        </div>
                        <div></div>
                         <div>
                            <p className="text-muted-foreground">Account #</p>
                            <p>A111288</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Address</p>
                            <p>123 Davidson Ave, Somerset, New Jersey, United States, 08854</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Expiration Date</p>
                            <p>{submission.expiryDate}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'History' && (
                <div className="pt-4 text-center text-muted-foreground">
                    History details would be displayed here.
                </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button variant="outline">Save</Button>
            <Button>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
