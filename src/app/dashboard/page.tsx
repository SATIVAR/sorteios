import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Ticket, Users, CheckCircle } from "lucide-react";
import { raffles } from "@/lib/data";

export default function DashboardPage() {
  const totalParticipants = raffles.reduce((acc, r) => acc + r.participants.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold font-headline tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's an overview of your raffles.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Raffles</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{raffles.length}</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">Across all active raffles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Raffles</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{raffles.filter(r => r.status === 'Completed').length}</div>
            <p className="text-xs text-muted-foreground">All winners drawn</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
            <CardHeader>
                <CardTitle>Raffle Management</CardTitle>
                <CardDescription>View, manage, and run your raffles.</CardDescription>
            </CardHeader>
            <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Participants</TableHead>
                <TableHead className="text-right">Winners</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raffles.map((raffle) => (
                <TableRow key={raffle.id}>
                  <TableCell className="font-medium">{raffle.title}</TableCell>
                  <TableCell>
                    <Badge variant={raffle.status === 'Active' ? 'default' : raffle.status === 'Completed' ? 'secondary' : 'outline'}
                    className={raffle.status === 'Active' ? 'bg-green-600 text-white' : ''}
                    >
                        {raffle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{raffle.participants.length} / {raffle.totalParticipants}</TableCell>
                  <TableCell className="text-right">{raffle.winners.length} / {raffle.totalWinners}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/raffle">Run Raffle</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Manage Participants</DropdownMenuItem>
                        <DropdownMenuItem>View Winners</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
