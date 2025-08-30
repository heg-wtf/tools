import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function UuidGenerator() {
  const [generatedUuids, setGeneratedUuids] = useState([])
  const [uuidCount, setUuidCount] = useState(1)
  const [copyMessage, setCopyMessage] = useState('')

  // UUID v4 생성 함수
  const generateUuidV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // UUID 생성
  const generateUuids = () => {
    const count = Math.max(1, Math.min(100, parseInt(uuidCount) || 1))
    const newUuids = []
    
    for (let i = 0; i < count; i++) {
      newUuids.push({
        id: Date.now() + i,
        uuid: generateUuidV4(),
        timestamp: new Date()
      })
    }
    
    setGeneratedUuids(newUuids)
    setCopyMessage('')
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

  // 모든 UUID 복사 (줄바꿈으로 구분)
  const copyAllUuids = () => {
    const allUuids = generatedUuids.map(item => item.uuid).join('\n')
    copyToClipboard(allUuids)
  }

  // 초기화
  const clearUuids = () => {
    setGeneratedUuids([])
    setCopyMessage('')
  }

  // UUID 개수 변경 핸들러
  const handleCountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 100)) {
      setUuidCount(value)
    }
  }

  // UUID 유효성 검증
  const validateUuid = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">UUID 생성기</h1>
        <p className="text-muted-foreground mb-8">
          UUID v4 (Universally Unique Identifier)를 생성할 수 있는 도구입니다.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* UUID 생성 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🆔 UUID 생성
                <Badge variant="secondary">v4</Badge>
              </CardTitle>
              <CardDescription>
                랜덤 기반의 UUID v4를 생성합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">생성할 개수 (1-100)</label>
                <Input
                  type="text"
                  placeholder="1"
                  value={uuidCount}
                  onChange={handleCountChange}
                  className="text-lg"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={generateUuids}
                  className="flex-1"
                >
                  UUID 생성
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearUuids}
                  disabled={generatedUuids.length === 0}
                >
                  초기화
                </Button>
              </div>

              {copyMessage && (
                <div className="p-2 bg-green-100 text-green-800 rounded-md text-sm text-center">
                  {copyMessage}
                </div>
              )}
            </CardContent>
          </Card>

          {/* UUID 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 UUID 정보
              </CardTitle>
              <CardDescription>
                UUID의 특징과 구조에 대한 정보입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">UUID v4 특징</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 128비트 (32자리 16진수)</li>
                  <li>• 하이픈으로 구분된 5개 그룹</li>
                  <li>• 랜덤/의사랜덤 기반 생성</li>
                  <li>• 전역적으로 고유한 식별자</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">구조 예시</h4>
                <div className="p-2 bg-muted/50 rounded text-xs font-mono">
                  <div>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</div>
                  <div className="text-muted-foreground mt-1">
                    8-4-4-4-12 자리 형식
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">사용 예시</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 데이터베이스 기본키</li>
                  <li>• 세션 ID</li>
                  <li>• 파일명 생성</li>
                  <li>• API 요청 추적</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 생성된 UUID 목록 */}
        {generatedUuids.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  📝 생성된 UUID
                  <Badge variant="outline">{generatedUuids.length}개</Badge>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyAllUuids}
                >
                  전체 복사
                </Button>
              </div>
              <CardDescription>
                생성된 UUID를 클릭하면 클립보드에 복사됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generatedUuids.map((item, index) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => copyToClipboard(item.uuid)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-6">
                        {index + 1}.
                      </span>
                      <code className="font-mono text-sm flex-1 select-all">
                        {item.uuid}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      {validateUuid(item.uuid) && (
                        <Badge variant="outline" className="text-xs">
                          유효
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        클릭하여 복사
                      </span>
                    </div>
                  </div>
                ))}
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">1. 개수 설정</h4>
                <p className="text-sm text-muted-foreground">
                  생성할 UUID 개수를 1~100 사이로 설정합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. UUID 생성</h4>
                <p className="text-sm text-muted-foreground">
                  "UUID 생성" 버튼을 클릭하여 새로운 UUID를 생성합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. 복사 및 사용</h4>
                <p className="text-sm text-muted-foreground">
                  생성된 UUID를 클릭하거나 "전체 복사"로 모든 UUID를 복사할 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UuidGenerator
