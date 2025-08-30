import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function UtcConverter() {
  const [localTime, setLocalTime] = useState('')
  const [utcTime, setUtcTime] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 로컬 시간 → UTC 변환
  const convertLocalToUtc = (localDateTime) => {
    if (!localDateTime) return ''
    
    try {
      const localDate = new Date(localDateTime)
      if (isNaN(localDate.getTime())) return ''
      
      return localDate.toISOString().slice(0, 19).replace('T', ' ')
    } catch (error) {
      return ''
    }
  }

  // UTC → 로컬 시간 변환
  const convertUtcToLocal = (utcDateTime) => {
    if (!utcDateTime) return ''
    
    try {
      const utcDate = new Date(utcDateTime + 'Z') // Z를 추가해서 UTC로 처리
      if (isNaN(utcDate.getTime())) return ''
      
      const year = utcDate.getFullYear()
      const month = String(utcDate.getMonth() + 1).padStart(2, '0')
      const day = String(utcDate.getDate()).padStart(2, '0')
      const hours = String(utcDate.getHours()).padStart(2, '0')
      const minutes = String(utcDate.getMinutes()).padStart(2, '0')
      const seconds = String(utcDate.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    } catch (error) {
      return ''
    }
  }

  // 로컬 시간 입력 핸들러
  const handleLocalTimeChange = (e) => {
    const value = e.target.value
    setLocalTime(value)
    setUtcTime(convertLocalToUtc(value))
  }

  // UTC 시간 입력 핸들러
  const handleUtcTimeChange = (e) => {
    const value = e.target.value
    setUtcTime(value)
    setLocalTime(convertUtcToLocal(value))
  }

  // 현재 시간으로 설정
  const setCurrentLocalTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    
    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    setLocalTime(localDateTime)
    setUtcTime(convertLocalToUtc(localDateTime))
  }

  // 현재 UTC 시간으로 설정
  const setCurrentUtcTime = () => {
    const now = new Date()
    const utcDateTime = now.toISOString().slice(0, 19).replace('T', ' ')
    setUtcTime(utcDateTime)
    setLocalTime(convertUtcToLocal(utcDateTime))
  }

  // 초기화
  const handleReset = () => {
    setLocalTime('')
    setUtcTime('')
  }

  // 시간대 정보 가져오기
  const getTimezoneInfo = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = -new Date().getTimezoneOffset() / 60
    const offsetString = offset >= 0 ? `+${offset}` : `${offset}`
    return { timezone, offset: offsetString }
  }

  const timezoneInfo = getTimezoneInfo()

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">UTC 변환기</h1>
        <p className="text-muted-foreground mb-8">
          로컬 시간과 UTC 시간을 양방향으로 변환할 수 있는 도구입니다.
        </p>
        
        {/* 현재 시간 표시 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⏰ 현재 시간
              <Badge variant="outline">실시간</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">로컬 시간 ({timezoneInfo.timezone})</label>
                <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                  {currentTime.toLocaleString('ko-KR', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                  })}
                  <span className="text-sm text-muted-foreground ml-2">
                    (UTC{timezoneInfo.offset})
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">UTC 시간</label>
                <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                  {currentTime.toISOString().slice(0, 19).replace('T', ' ')}
                  <span className="text-sm text-muted-foreground ml-2">
                    (UTC+0)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 시간 변환 입력 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔄 시간 변환
              </CardTitle>
              <CardDescription>
                로컬 시간 또는 UTC 시간 중 하나를 입력하면 자동으로 변환됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">로컬 시간 ({timezoneInfo.timezone})</label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={setCurrentLocalTime}
                  >
                    현재 시간
                  </Button>
                </div>
                <Input
                  type="datetime-local"
                  step="1"
                  value={localTime}
                  onChange={handleLocalTimeChange}
                  className="text-lg font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">UTC 시간</label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={setCurrentUtcTime}
                  >
                    현재 UTC
                  </Button>
                </div>
                <Input
                  type="text"
                  placeholder="YYYY-MM-DD HH:MM:SS"
                  value={utcTime}
                  onChange={handleUtcTimeChange}
                  className="text-lg font-mono"
                />
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="w-full"
              >
                초기화
              </Button>
            </CardContent>
          </Card>

          {/* 변환 결과 및 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 변환 정보
              </CardTitle>
              <CardDescription>
                시간대 정보와 변환 결과를 확인할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">현재 시간대</label>
                <div className="p-3 bg-muted/50 rounded-md">
                  <div className="font-mono">{timezoneInfo.timezone}</div>
                  <div className="text-sm text-muted-foreground">
                    UTC{timezoneInfo.offset} 시간
                  </div>
                </div>
              </div>
              
              {(localTime || utcTime) && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">변환된 로컬 시간</label>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
                      <div className="font-mono text-lg">
                        {localTime ? new Date(localTime).toLocaleString('ko-KR') : '-'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">변환된 UTC 시간</label>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
                      <div className="font-mono text-lg">
                        {utcTime || '-'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 사용 방법 안내 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 사용 방법
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">1. 로컬 → UTC 변환</h4>
                <p className="text-sm text-muted-foreground">
                  로컬 시간을 입력하면 해당하는 UTC 시간이 자동으로 계산됩니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. UTC → 로컬 변환</h4>
                <p className="text-sm text-muted-foreground">
                  UTC 시간을 입력하면 현재 시간대의 로컬 시간으로 변환됩니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. 현재 시간 사용</h4>
                <p className="text-sm text-muted-foreground">
                  "현재 시간" 또는 "현재 UTC" 버튼을 클릭해서 빠르게 설정할 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UtcConverter
