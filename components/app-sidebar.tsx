'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  ListTodo,
  PhoneCall,
  Building,
  BarChart3,
  Ticket,
  CalendarClock,
  Activity,
  ShieldCheck,
  MessageSquareWarning,
  ReceiptText,
  UserPlus,
  LogOut,
  Building2,
  UserCheck,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { useAuth } from '@/lib/auth-context'

const adminMenuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Employees', url: '/employees', icon: Users },
  { title: 'Attendance', url: '/attendance', icon: ClipboardCheck },
  { title: 'Tasks', url: '/tasks', icon: ListTodo },
  { title: 'Shifts', url: '/shifts', icon: CalendarClock },
  { title: 'Performance', url: '/performance', icon: Activity },
  { title: 'Recruitment', url: '/recruitment', icon: UserPlus },
  { title: 'Reports', url: '/reports', icon: BarChart3 },
]

const customerMenuItems = [
  { title: 'Control Panel', url: '/customer-panel', icon: LayoutDashboard },
  { title: 'Customers', url: '/customers', icon: UserCheck },
  { title: 'Calls', url: '/calls', icon: PhoneCall },
  { title: 'Tickets', url: '/tickets', icon: Ticket },
  { title: 'Complaints', url: '/complaints', icon: MessageSquareWarning },
]

const clientMenuItems = [
  { title: 'Clients', url: '/clients', icon: Building },
  { title: 'SLA', url: '/sla', icon: ShieldCheck },
  { title: 'Billing', url: '/billing', icon: ReceiptText },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-sidebar-foreground">BPO SYSTEM.com</span>
            <span className="text-xs text-muted-foreground">Control Panel</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Admin / You
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Customers Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Customer Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {/* Clients Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Clients
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clientMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                logout()
                window.location.href = '/login'
              }}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
