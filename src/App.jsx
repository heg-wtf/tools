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
import UtcConverter from './components/UtcConverter'
import UuidGenerator from './components/UuidGenerator'
import MysqlPasswordGenerator from './components/MysqlPasswordGenerator'
import UnixTimestamp from './components/UnixTimestamp'
import CompoundInterestCalculator from './components/CompoundInterestCalculator'
import LoanCalculator from './components/LoanCalculator'
import InvestmentReturnCalculator from './components/InvestmentReturnCalculator'
import CurrencyConverter from './components/CurrencyConverter'
import TaxCalculator from './components/TaxCalculator'
import JsonFormatter from './components/JsonFormatter'
import Base64Encoder from './components/Base64Encoder'
import HashGenerator from './components/HashGenerator'
import QrCodeGenerator from './components/QrCodeGenerator'
import ColorConverter from './components/ColorConverter'
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
    title: "부가세 계산기",
    icon: "💰",
    id: "vat-calculator"
  },
  {
    title: "복리 계산기",
    icon: "📈",
    id: "compound-interest-calculator"
  },
  {
    title: "대출 계산기",
    icon: "🏦",
    id: "loan-calculator"
  },
  {
    title: "투자 수익률 계산기",
    icon: "📊",
    id: "investment-return-calculator"
  },
  {
    title: "환율 변환기",
    icon: "💱",
    id: "currency-converter"
  },
  {
    title: "소득세 계산기",
    icon: "📋",
    id: "tax-calculator"
  }
]

const dateTimeMenuItems = [
  {
    title: "UTC 변환기",
    icon: "🕐",
    id: "utc-converter"
  },
  {
    title: "Unix Timestamp",
    icon: "⏱️",
    id: "unix-timestamp"
  }
]

const techMenuItems = [
  {
    title: "UUID 생성기",
    icon: "🆔",
    id: "uuid-generator"
  },
  {
    title: "MySQL 암호 생성기",
    icon: "🔐",
    id: "mysql-password-generator"
  },
  {
    title: "JSON 포맷터",
    icon: "📝",
    id: "json-formatter"
  },
  {
    title: "Base64 인코더/디코더",
    icon: "🔤",
    id: "base64-encoder"
  },
  {
    title: "해시 생성기",
    icon: "🔐",
    id: "hash-generator"
  },
  {
    title: "QR 코드 생성기",
    icon: "📱",
    id: "qr-code-generator"
  },
  {
    title: "색상 변환기",
    icon: "🎨",
    id: "color-converter"
  }
]

// 사이드바 컴포넌트
function AppSidebar({ activeItem, setActiveItem }) {
  return (
    <Sidebar role="navigation" aria-label="도구 메뉴">
      <SidebarHeader>
        <SidebarMenuButton
          onClick={() => setActiveItem("default")}
          className="flex items-center gap-2 px-2 py-2 w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors cursor-pointer"
          isActive={activeItem === "default"}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground" aria-hidden="true">
            🛠️
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Tools</span>
            <span className="truncate text-xs text-muted-foreground">v1.0.0</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>위치 도구</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu role="list">
              {locationMenuItems.map((item) => (
                <SidebarMenuItem key={item.id} role="listitem">
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                    aria-label={`${item.title} 도구 선택`}
                  >
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>금융 계산기</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu role="list">
              {financeMenuItems.map((item) => (
                <SidebarMenuItem key={item.id} role="listitem">
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                    aria-label={`${item.title} 도구 선택`}
                  >
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>시간 도구</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu role="list">
              {dateTimeMenuItems.map((item) => (
                <SidebarMenuItem key={item.id} role="listitem">
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                    aria-label={`${item.title} 도구 선택`}
                  >
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>개발 도구</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu role="list">
              {techMenuItems.map((item) => (
                <SidebarMenuItem key={item.id} role="listitem">
                  <SidebarMenuButton
                    isActive={activeItem === item.id}
                    onClick={() => setActiveItem(item.id)}
                    aria-label={`${item.title} 도구 선택`}
                  >
                    <span className="text-lg" aria-hidden="true">{item.icon}</span>
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
      case 'compound-interest-calculator':
        return <CompoundInterestCalculator />
      case 'loan-calculator':
        return <LoanCalculator />
      case 'investment-return-calculator':
        return <InvestmentReturnCalculator />
      case 'currency-converter':
        return <CurrencyConverter />
      case 'tax-calculator':
        return <TaxCalculator />
      case 'utc-converter':
        return <UtcConverter />
      case 'uuid-generator':
        return <UuidGenerator />
      case 'mysql-password-generator':
        return <MysqlPasswordGenerator />
      case 'unix-timestamp':
        return <UnixTimestamp />
      case 'json-formatter':
        return <JsonFormatter />
      case 'base64-encoder':
        return <Base64Encoder />
      case 'hash-generator':
        return <HashGenerator />
      case 'qr-code-generator':
        return <QrCodeGenerator />
      case 'color-converter':
        return <ColorConverter />
      default:
        return (
          <main className="flex-1 p-8" role="main">
            <div className="max-w-4xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">개발자 도구 모음</h1>
                <p className="text-muted-foreground mb-4">
                  개발자를 위한 필수 온라인 도구 모음. 다양한 유용한 도구들을 무료로 사용해보세요.
                </p>
                <nav aria-label="도구 카테고리">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      💻 개발 도구
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                      💰 금융 계산기
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                      🕐 시간 도구
                    </span>
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">
                      📍 위치 도구
                    </span>
                  </div>
                </nav>
              </header>
              
              <section className="bg-muted/20 border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center" aria-label="도구 선택 안내">
                <h2 className="sr-only">도구 선택</h2>
                <p className="text-muted-foreground">
                  왼쪽 사이드바에서 원하는 도구를 선택하세요.
                </p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>개발 도구</strong>
                    <br />UUID, JSON, Base64 등
                  </div>
                  <div>
                    <strong>금융 계산</strong>
                    <br />부가세, 대출, 투자 등
                  </div>
                  <div>
                    <strong>시간 변환</strong>
                    <br />UTC, Unix 타임스탬프
                  </div>
                  <div>
                    <strong>기타 도구</strong>
                    <br />QR코드, 색상 변환 등
                  </div>
                </div>
              </section>
            </div>
          </main>
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
        <main className="flex-1" role="main">
          <header className="flex items-center gap-2 p-4 border-b" role="banner">
            <SidebarTrigger aria-label="사이드바 토글" />
            <Separator orientation="vertical" className="h-4" />
            <h1 className="font-semibold">개발자 도구 대시보드</h1>
          </header>
          <MainContent activeItem={activeItem} />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default App
