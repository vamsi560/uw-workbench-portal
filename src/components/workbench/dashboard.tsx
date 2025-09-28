import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
  } from 'recharts';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
  } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import {
    ArrowUpDown,
    Download,
    ListFilter,
    RefreshCw,
    Trash2,
  } from 'lucide-react';
  
// Cyber Insurance specific data
const cyberRiskData = [
  { name: 'Healthcare', value: 85, count: 12 },
  { name: 'Financial Services', value: 90, count: 8 },
  { name: 'Technology', value: 75, count: 15 },
  { name: 'Manufacturing', value: 65, count: 20 },
  { name: 'Retail', value: 70, count: 18 },
];

const policyTypeData = [
  { name: 'First Party Coverage', value: 35 },
  { name: 'Third Party Liability', value: 28 },
  { name: 'Comprehensive Cyber', value: 25 },
  { name: 'Business Interruption', value: 12 },
];
const policyTypeColors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db'];

const workItemStatusData = [
  { name: 'Pending Review', value: 24 },
  { name: 'Risk Assessment', value: 18 },
  { name: 'Underwriting', value: 12 },
  { name: 'Completed', value: 8 },
];

const riskScoreDistribution = [
  { name: 'Low (0-40)', value: 15, color: '#2ecc71' },
  { name: 'Moderate (41-60)', value: 22, color: '#3498db' },
  { name: 'Medium (61-80)', value: 28, color: '#f39c12' },
  { name: 'High (81-100)', value: 18, color: '#e74c3c' },
];  export function Dashboard() {
    return (
      <div className="bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Cyber Risk by Industry */}
          <Card className="md:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base font-semibold">
                <span>Cyber Risk by Industry</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ListFilter className="h-4 w-4 mr-2" /> Bar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cyberRiskData} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}}/>
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'value' ? `Risk Score: ${value}` : `Applications: ${value}`,
                      name === 'value' ? 'Risk Score' : 'Count'
                    ]}
                  />
                  <Bar dataKey="value" fill="#e74c3c" barSize={12} name="Risk Score" />
                  <Bar dataKey="count" fill="#3498db" barSize={12} name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline">+ REPORT</Button>
            </CardFooter>
          </Card>

          {/* Policy Coverage Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base font-semibold">
                <span>Policy Coverage Types</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                    <Button variant="ghost" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ListFilter className="h-4 w-4 mr-2" /> Pie
                  </Button>
                    <Button variant="ghost" size="sm">
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={policyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {policyTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={policyTypeColors[index % policyTypeColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
              <CardFooter className="justify-center">
              <Button variant="outline">+ REPORT</Button>
            </CardFooter>
          </Card>

          {/* Work Item Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base font-semibold">
                <span>Work Items by Status</span>
                  <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                    <Button variant="ghost" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                      <ListFilter className="h-4 w-4 mr-2" /> Bar
                  </Button>
                    <Button variant="ghost" size="sm">
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workItemStatusData} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
              <CardFooter className="justify-center">
              <Button variant="outline">+ REPORT</Button>
            </CardFooter>
          </Card>

          {/* Risk Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base font-semibold">
                <span>Risk Score Distribution</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ListFilter className="h-4 w-4 mr-2" /> Donut
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ListFilter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskScoreDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskScoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} applications`, 'Count']} />
                  <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline">+ REPORT</Button>
            </CardFooter>
          </Card>
        </div>
          <div className="mt-6 flex justify-center">
            <Button variant="outline">+ REPORT</Button>
        </div>
      </div>
    );
  }
  