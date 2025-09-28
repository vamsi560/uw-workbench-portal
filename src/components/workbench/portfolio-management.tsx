"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/select";
import { Calendar, Download } from "lucide-react";

const pipelineData = [
  { name: "Submitted", value: 1303 },
  { name: "Quoted", value: 739 },
  { name: "Bound", value: 501 },
];

const leadersData = [
    { org: "Baron", submissions: 210, gwp: "$400,000", averageLine: "14%" },
    { org: "Biu", submissions: 180, gwp: "$320,123", averageLine: "12.5%" },
    { org: "ATO", submissions: 167, gwp: "$290,123", averageLine: "12.1%" },
];
  
const brokersData = [
    { org: "Aukiny", submissions: 273, gwp: "$470,000", avgCommission: "$2,300" },
    { org: "LBA", submissions: 239, gwp: "$310,000", avgCommission: "$1,450" },
    { org: "UIB", submissions: 95, gwp: "$220,000", avgCommission: "$1,320" },
];

const FunnelChart = () => {
    // This is a simplified representation. A real funnel chart would require a more complex setup or a different charting library.
    // We'll use an AreaChart to approximate the visual.
    const data = [
      { name: 'Submitted', value: [1000, 1600] },
      { name: 'Quoted', value: [1100, 1500] },
      { name: 'Bound', value: [1200, 1400] },
    ];
  
    return (
        <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorUv)" fillOpacity={1} />
            </AreaChart>
          </ResponsiveContainer>
    );
};

export function PortfolioManagement() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-3xl font-bold">Portfolio</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>14/06/2024 - 14/01/2025</span>
          </Button>
          <Select defaultValue="cyber">
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cyber">
                Cyber
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-sm">Underwriter</span>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">System statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total premium written
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$1,200,000</p>
              <p className="text-xs text-muted-foreground">
                vs $5,000,000 planned total premium
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Exposure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$3,200,000</p>
              <p className="text-xs text-muted-foreground">
                vs $10,000,000 planned exposure
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$200,000</p>
              <p className="text-xs text-muted-foreground">
                vs $1,250,000 planned total commission
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submission Pipeline & Risk Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Submission pipeline</h3>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-around mb-4">
                {pipelineData.map((item) => (
                  <div key={item.name} className="text-center">
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                    {item.name === "Quoted" && <p className="text-xs text-green-500">57% +</p>}
                    {item.name === "Bound" && <p className="text-xs text-green-500">68% +</p>}
                  </div>
                ))}
              </div>
              <FunnelChart />
            </CardContent>
          </Card>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Risk locations</h3>
          <Card>
            <CardContent className="p-6">
                <div className="h-[200px] bg-muted flex items-center justify-center rounded-md">
                    <img src="https://i.imgur.com/gC5eB7d.png" alt="World map with highlighted locations in North America and UK" className="object-contain h-full w-full"/>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leaders & Brokers Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Leaders</h3>
                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
            </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ORG</TableHead>
                  <TableHead>SUBMISSIONS</TableHead>
                  <TableHead>GWP</TableHead>
                  <TableHead>AVERAGE LINE %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadersData.map((leader) => (
                  <TableRow key={leader.org}>
                    <TableCell>{leader.org}</TableCell>
                    <TableCell>{leader.submissions}</TableCell>
                    <TableCell>{leader.gwp}</TableCell>
                    <TableCell>{leader.averageLine}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Brokers</h3>
                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
            </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ORG</TableHead>
                  <TableHead>SUBMISSIONS</TableHead>
                  <TableHead>GWP</TableHead>
                  <TableHead>AVG COMMISSION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokersData.map((broker) => (
                  <TableRow key={broker.org}>
                    <TableCell>{broker.org}</TableCell>
                    <TableCell>{broker.submissions}</TableCell>
                    <TableCell>{broker.gwp}</TableCell>
                    <TableCell>{broker.avgCommission}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
