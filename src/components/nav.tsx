'use client';

import { usePathname } from 'next/navigation';
import {
  CalendarClock,
  CloudSun,
  LayoutDashboard,
  LineChart,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crop-timing', label: 'Crop Timing', icon: CalendarClock },
  { href: '/yield-prediction', label: 'Yield Prediction', icon: LineChart },
  { href: '/weather', label: 'Weather', icon: CloudSun },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <a href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
