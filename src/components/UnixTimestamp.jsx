import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function UnixTimestamp() {
  const [timestamp, setTimestamp] = useState('')
  const [humanReadable, setHumanReadable] = useState('')
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const [copyMessage, setCopyMessage] = useState('')

  // 현재 타임스탬프 업데이트
  useEffect(() => {
    const updateCurrentTimestamp = () => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }
    
    updateCurrentTimestamp()
    const timer = setInterval(updateCurrentTimestamp, 1000)
    
    return () => clearInterval(timer)
  }, [])

  // Unix timestamp → 사람이 읽을 수 있는 시간
  const convertTimestampToHuman = (ts) => {
    if (!ts || isNaN(ts)) return ''
    
    try {
      const num = parseInt(ts)
      let date
      
      // 타임스탬프 길이에 따라 초/밀리초 판단
      if (ts.toString().length === 13) {
        // 밀리초
        date = new Date(num)
      } else {
        // 초
        date = new Date(num * 1000)
      }
      
      if (isNaN(date.getTime())) return ''
      
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      })
    } catch (error) {
      return ''
    }
  }

  // 사람이 읽을 수 있는 시간 → Unix timestamp
  const convertHumanToTimestamp = (dateTime) => {
    if (!dateTime) return ''
    
    try {
      const date = new Date(dateTime)
      if (isNaN(date.getTime())) return ''
      
      return Math.floor(date.getTime() / 1000).toString()
    } catch (error) {
      return ''
    }
  }

  // 타임스탬프 입력 핸들러
  const handleTimestampChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setTimestamp(value)
    setHumanReadable(convertTimestampToHuman(value))
  }

  // 사람이 읽을 수 있는 시간 입력 핸들러
  const handleHumanReadableChange = (e) => {
    const value = e.target.value
    setHumanReadable(value)
    setTimestamp(convertHumanToTimestamp(value))
  }

  // 현재 타임스탬프로 설정
  const setCurrentTime = () => {
    const now = Math.floor(Date.now() / 1000)
    setTimestamp(now.toString())
    setHumanReadable(convertTimestampToHuman(now.toString()))
  }

  // 현재 시간으로 설정 (datetime-local 형식)
  const setCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    
    const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    setHumanReadable(localDateTime)
    setTimestamp(convertHumanToTimestamp(localDateTime))
  }

  // 클립보드에 복사
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyMessage('클립보드에 복사되었습니다!')
      setTimeout(() => setCopyMessage(''), 3000)
    } catch (err) {
      setCopyMessage('복사 실패')
      setTimeout(() => setCopyMessage(''), 3000)
    }
  }

  // 초기화
  const handleReset = () => {
    setTimestamp('')
    setHumanReadable('')
    setCopyMessage('')
  }

  // 타임스탬프 유효성 검증
  const isValidTimestamp = (ts) => {
    if (!ts) return false
    const num = parseInt(ts)
    // 1970년 이후부터 2100년 정도까지의 합리적인 범위
    return num > 0 && num < 4102444800 // 2100-01-01
  }

  // 다양한 형식으로 변환
  const getFormattedDates = (ts) => {
    if (!isValidTimestamp(ts)) return null
    
    const num = parseInt(ts)
    const date = new Date(num * 1000)
    
    return {
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString('ko-KR'),
      date: date.toLocaleDateString('ko-KR'),
      time: date.toLocaleTimeString('ko-KR'),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    }
  }

  const formattedDates = getFormattedDates(timestamp)

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Unix Timestamp 변환기</h1>
        <p className="text-muted-foreground mb-8">
          Unix 타임스탬프와 사람이 읽을 수 있는 날짜/시간을 양방향으로 변환할 수 있는 도구입니다.
        </p>
        
        {/* 현재 타임스탬프 표시 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⏱️ 현재 Unix Timestamp
              <Badge variant="outline">실시간</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">현재 타임스탬프 (초)</label>
                <div 
                  className="p-3 bg-muted/50 rounded-md text-lg font-mono cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => copyToClipboard(currentTimestamp.toString())}
                >
                  {currentTimestamp}
                  <span className="text-sm text-muted-foreground ml-2">
                    (클릭하여 복사)
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">현재 시간</label>
                <div className="p-3 bg-muted/50 rounded-md text-lg">
                  {new Date().toLocaleString('ko-KR', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    timeZoneName: 'short'
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 타임스탬프 변환 입력 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔄 타임스탬프 변환
              </CardTitle>
              <CardDescription>
                Unix 타임스탬프 또는 날짜/시간 중 하나를 입력하면 자동으로 변환됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Unix Timestamp (초)</label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={setCurrentTime}
                  >
                    현재 시간
                  </Button>
                </div>
                <Input
                  type="text"
                  placeholder="예: 1640995200"
                  value={timestamp}
                  onChange={handleTimestampChange}
                  className="text-lg font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">날짜/시간</label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={setCurrentDateTime}
                  >
                    현재 날짜
                  </Button>
                </div>
                <Input
                  type="datetime-local"
                  step="1"
                  value={humanReadable}
                  onChange={handleHumanReadableChange}
                  className="text-lg"
                />
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="w-full"
              >
                초기화
              </Button>

              {copyMessage && (
                <div className="p-2 bg-green-100 text-green-800 rounded-md text-sm text-center">
                  {copyMessage}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 변환 결과 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 변환 결과
              </CardTitle>
              <CardDescription>
                입력된 값의 다양한 형식 표현입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formattedDates ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Unix Timestamp</label>
                    <div 
                      className="p-3 bg-primary/10 border border-primary/20 rounded-md font-mono cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => copyToClipboard(timestamp)}
                    >
                      {timestamp}
                      <span className="text-xs text-muted-foreground ml-2">
                        (클릭하여 복사)
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">로컬 시간</label>
                    <div 
                      className="p-3 bg-muted/50 rounded-md cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => copyToClipboard(formattedDates.local)}
                    >
                      {formattedDates.local}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">ISO 8601</label>
                    <div 
                      className="p-3 bg-muted/50 rounded-md font-mono text-sm cursor-pointer hover:bg-muted/70 transition-colors break-all"
                      onClick={() => copyToClipboard(formattedDates.iso)}
                    >
                      {formattedDates.iso}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">UTC</label>
                    <div 
                      className="p-3 bg-muted/50 rounded-md font-mono text-sm cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => copyToClipboard(formattedDates.utc)}
                    >
                      {formattedDates.utc}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  타임스탬프 또는 날짜를 입력하세요
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 세부 정보 */}
        {formattedDates && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 세부 정보
              </CardTitle>
              <CardDescription>
                날짜/시간의 각 구성 요소입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">연도</label>
                  <div className="p-2 bg-muted/30 rounded text-center font-mono">
                    {formattedDates.year}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">월</label>
                  <div className="p-2 bg-muted/30 rounded text-center font-mono">
                    {formattedDates.month}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">일</label>
                  <div className="p-2 bg-muted/30 rounded text-center font-mono">
                    {formattedDates.day}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">시</label>
                  <div className="p-2 bg-muted/30 rounded text-center font-mono">
                    {formattedDates.hours}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">분</label>
                  <div className="p-2 bg-muted/30 rounded text-center font-mono">
                    {formattedDates.minutes}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">초</label>
                  <div className="p-2 bg-muted/30 rounded text-center font-mono">
                    {formattedDates.seconds}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 사용 방법 안내 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 사용 방법
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Unix Timestamp란?</h4>
                <p className="text-sm text-muted-foreground">
                  1970년 1월 1일 00:00:00 UTC부터 경과한 초의 수입니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. Timestamp → 날짜</h4>
                <p className="text-sm text-muted-foreground">
                  Unix 타임스탬프를 입력하면 해당하는 날짜/시간으로 변환됩니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. 날짜 → Timestamp</h4>
                <p className="text-sm text-muted-foreground">
                  날짜/시간을 입력하면 Unix 타임스탬프로 변환됩니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">4. 복사 기능</h4>
                <p className="text-sm text-muted-foreground">
                  결과값들을 클릭하면 클립보드에 복사됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UnixTimestamp
