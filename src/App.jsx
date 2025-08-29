import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LocationConverter from './components/LocationConverter'
import VatCalculator from './components/VatCalculator'
import './App.css'

// 메뉴 아이템들
const locationMenuItems = [
  {
    title: "주소 위경도 변환",
    icon: "📍",
    id: "location-converter"
  }
]

const financeMenuItems = [
  {
    title: "부가세",
    icon: "💰",
    id: "vat-calculator"
  }
]

// 사이드바 컴포넌트
function AppSidebar({ activeItem, setActiveItem }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            🛠️
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Tools</span>
            <span className="truncate text-xs text-muted-foreground">v1.0.0</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Location</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {locationMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {financeMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/api/placeholder/32/32" alt="사용자" />
                    <AvatarFallback className="rounded-lg">개</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">개발자</span>
                    <span className="truncate text-xs">dev@example.com</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/api/placeholder/32/32" alt="사용자" />
                      <AvatarFallback className="rounded-lg">개</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">개발자</span>
                      <span className="truncate text-xs">dev@example.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>👤</span>
                  프로필
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>⚙️</span>
                  계정 설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>🚪</span>
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// 메인 콘텐츠 컴포넌트
function MainContent({ activeItem }) {
  const renderContent = () => {
    switch (activeItem) {
      case 'location-converter':
        return <LocationConverter />
      case 'vat-calculator':
        return <VatCalculator />
      default:
        return (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">Tools</h1>
              <p className="text-muted-foreground mb-8">
                다양한 유용한 도구들을 사용해보세요.
              </p>
              
              <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                <p className="text-muted-foreground">
                  왼쪽 사이드바에서 도구를 선택하세요.
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return renderContent()
}

function App() {
  const [activeItem, setActiveItem] = useState("default")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="flex-1">
          <div className="flex items-center gap-2 p-4 border-b">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <span className="font-semibold">Tools Dashboard</span>
          </div>
          <MainContent activeItem={activeItem} />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App
