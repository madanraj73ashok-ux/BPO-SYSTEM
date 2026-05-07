'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useClientsStore } from '@/lib/demo-store'
import { showErrorToast } from '@/lib/client-errors'
import { Client } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { ClientForm } from '@/components/client-form'
import { Eye, Pencil, Trash2 } from 'lucide-react'

function getContractVariant(status: Client['contractStatus']) {
  switch (status) {
    case 'Active':
      return 'default'
    case 'Expired':
      return 'destructive'
    case 'Pending':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function ClientsPage() {
  const { clients, addClient, deleteClient, updateClient } = useClientsStore()
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleAddClient = async (data: Omit<Client, 'id'>) => {
    try {
      await addClient(data)
    } catch (error) {
      showErrorToast('Failed to add client', error)
    }
  }

  const handleUpdateClient = async (id: number, data: Omit<Client, 'id'>) => {
    try {
      await updateClient(id, data)
    } catch (error) {
      showErrorToast('Failed to update client', error)
    }
  }

  const handleDeleteClient = async () => {
    if (!deleteId) return
    try {
      await deleteClient(deleteId)
      setDeleteId(null)
    } catch (error) {
      showErrorToast('Failed to delete client', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Manage client companies and BPO service contracts
          </p>
        </div>
        <ClientForm onSubmit={handleAddClient} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Accounts ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client Company</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Contract Status</TableHead>
                  <TableHead className="text-right">Monthly Billing</TableHead>
                  <TableHead>Assigned Team</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">#{client.id}</TableCell>
                    <TableCell className="font-medium">
                      {client.clientCompany}
                    </TableCell>
                    <TableCell>{client.serviceType}</TableCell>
                    <TableCell>{client.contactPerson}</TableCell>
                    <TableCell>
                      <Badge variant={getContractVariant(client.contractStatus)}>
                        {client.contractStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(client.monthlyBilling)}
                    </TableCell>
                    <TableCell>{client.assignedTeam}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <ClientForm
                          initialData={client}
                          onSubmit={(data) => handleUpdateClient(client.id, data)}
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
