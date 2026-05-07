'use client'

import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { CustomerForm } from '@/components/customer-form'
import { showErrorToast } from '@/lib/client-errors'
import { Customer } from '@/lib/types'
import { useCustomersStore } from '@/lib/demo-store'
import { Eye, Pencil, Trash2 } from 'lucide-react'

function getStatusVariant(status: Customer['status']) {
  switch (status) {
    case 'Active':
      return 'default'
    case 'Inactive':
      return 'secondary'
    case 'Pending':
      return 'outline'
    default:
      return 'secondary'
  }
}

export default function CustomersPage() {
  const { customers, addCustomer, deleteCustomer, updateCustomer } = useCustomersStore()
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleAddCustomer = async (data: Omit<Customer, 'id'>) => {
    try {
      await addCustomer(data)
    } catch (error) {
      showErrorToast('Failed to add customer', error)
    }
  }

  const handleUpdateCustomer = async (id: number, data: Omit<Customer, 'id'>) => {
    try {
      await updateCustomer(id, data)
    } catch (error) {
      showErrorToast('Failed to update customer', error)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!deleteId) return
    try {
      await deleteCustomer(deleteId)
      setDeleteId(null)
    } catch (error) {
      showErrorToast('Failed to delete customer', error)
    }
  }

  const getStatusBadge = (status: Customer['status']) => (
    <Badge variant={getStatusVariant(status)} className="capitalize">
      {status}
    </Badge>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer database
          </p>
        </div>
        <CustomerForm onSubmit={handleAddCustomer} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">#{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>{customer.registrationDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <CustomerForm
                          initialData={customer}
                          onSubmit={(data) => handleUpdateCustomer(customer.id, data)}
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
                          onClick={() => setDeleteId(customer.id)}
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
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
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
