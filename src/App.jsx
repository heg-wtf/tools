import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            shadcn/ui + React 앱
          </h1>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            최신 버전 적용 완료 ✨
          </Badge>
        </div>

        {/* 메인 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 카운터 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>카운터 예제</CardTitle>
              <CardDescription>
                shadcn/ui Button 컴포넌트를 사용한 카운터입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {count}
                </div>
                <div className="space-x-2">
                  <Button onClick={() => setCount(count + 1)}>
                    증가 (+)
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setCount(count - 1)}
                  >
                    감소 (-)
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => setCount(0)}
                  >
                    리셋
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>입력 예제</CardTitle>
              <CardDescription>
                shadcn/ui Input 컴포넌트를 사용한 입력 필드입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                placeholder="여기에 텍스트를 입력하세요..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {inputValue && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">입력된 내용:</p>
                  <p className="font-medium">{inputValue}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setInputValue('')}
              >
                입력 내용 지우기
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>🎉 설치 완료된 컴포넌트들</CardTitle>
            <CardDescription>
              현재 프로젝트에서 사용할 수 있는 shadcn/ui 컴포넌트들입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Button</Badge>
              <Badge variant="secondary">Card</Badge>
              <Badge variant="outline">Input</Badge>
              <Badge variant="destructive">Badge</Badge>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>추가 컴포넌트 설치:</strong> <code>npx shadcn@latest add [컴포넌트명]</code>
              </p>
              <p className="text-sm text-blue-700 mt-1">
                사용 가능한 컴포넌트: dialog, dropdown-menu, select, checkbox, radio-group, textarea, label 등
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
