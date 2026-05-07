'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Client } from '@/lib/types'
import { Plus } from 'lucide-react'

type ClientFormProps = {
  onSubmit: (data: Omit<Client, 'id'>) => void
  initialData?: Client
  trigger?: React.ReactNode
}

export function ClientForm({ onSubmit, initialData, trigger }: ClientFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    clientCompany: initialData?.clientCompany || '',
    serviceType: initialData?.serviceType || '',
    contactPerson: initialData?.contactPerson || '',
    contractStatus: initialData?.contractStatus || 'Active',
    monthlyBilling: initialData?.monthlyBilling || 0,
    assignedTeam: initialData?.assignedTeam || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      clientCompany: '',
      serviceType: '',
      contactPerson: '',
      contractStatus: 'Active',
      monthlyBilling: 0,
      assignedTeam: '',
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update client information' : 'Fill in the details below to add a new client.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Client Company *</Label>
            <Input
              id="company"
              placeholder="Enter company name"
              value={formData.clientCompany}
              onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service Type *</Label>
            <Input
              id="service"
              placeholder="e.g., Customer Support, Data Entry"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Person *</Label>
            <Input
              id="contact"
              placeholder="Enter contact person name"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Contract Status *</Label>
              <Select
                value={formData.contractStatus}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    contractStatus: value as Client['contractStatus'],
                  })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing">Monthly Billing (Rs.) *</Label>
              <Input
                id="billing"
                type="number"
                placeholder="0"
                value={formData.monthlyBilling}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyBilling: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Assigned Team *</Label>
            <Input
              id="team"
              placeholder="e.g., Team Alpha"
              value={formData.assignedTeam}
              onChange={(e) => setFormData({ ...formData, assignedTeam: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
