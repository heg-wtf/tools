import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      setStats(null)
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
      
      // JSON 통계 계산
      const stats = analyzeJson(parsed)
      setStats(stats)
    } catch (err) {
      setError(`JSON 파싱 오류: ${err.message}`)
      setOutput('')
      setStats(null)
    }
  }

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      setStats(null)
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
      
      const stats = analyzeJson(parsed)
      setStats(stats)
    } catch (err) {
      setError(`JSON 파싱 오류: ${err.message}`)
      setOutput('')
      setStats(null)
    }
  }

  const analyzeJson = (obj) => {
    const stats = {
      keys: 0,
      values: 0,
      arrays: 0,
      objects: 0,
      strings: 0,
      numbers: 0,
      booleans: 0,
      nulls: 0,
      maxDepth: 0
    }

    const analyze = (item, depth = 0) => {
      stats.maxDepth = Math.max(stats.maxDepth, depth)

      if (Array.isArray(item)) {
        stats.arrays++
        item.forEach(element => analyze(element, depth + 1))
      } else if (item !== null && typeof item === 'object') {
        stats.objects++
        Object.entries(item).forEach(([key, value]) => {
          stats.keys++
          analyze(value, depth + 1)
        })
      } else {
        stats.values++
        if (typeof item === 'string') stats.strings++
        else if (typeof item === 'number') stats.numbers++
        else if (typeof item === 'boolean') stats.booleans++
        else if (item === null) stats.nulls++
      }
    }

    analyze(obj)
    return stats
  }

  const validateJson = () => {
    if (!input.trim()) {
      setError('JSON을 입력해주세요.')
      return
    }

    try {
      JSON.parse(input)
      setError('')
      alert('✅ 유효한 JSON입니다!')
    } catch (err) {
      setError(`❌ 유효하지 않은 JSON: ${err.message}`)
    }
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
    setError('')
    setStats(null)
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('클립보드에 복사되었습니다!')
    } catch (err) {
      console.error('복사 실패:', err)
      alert('복사에 실패했습니다.')
    }
  }

  const loadSampleJson = () => {
    const sample = {
      "name": "홍길동",
      "age": 30,
      "isStudent": false,
      "address": {
        "city": "서울",
        "zipcode": "12345",
        "coordinates": {
          "lat": 37.5665,
          "lng": 126.9780
        }
      },
      "hobbies": ["독서", "영화감상", "프로그래밍"],
      "spouse": null,
      "skills": [
        {
          "name": "JavaScript",
          "level": "고급",
          "experience": 5
        },
        {
          "name": "React",
          "level": "중급",
          "experience": 3
        }
      ]
    }
    setInput(JSON.stringify(sample, null, 2))
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">JSON 포맷터</h1>
        <p className="text-muted-foreground mb-8">
          JSON 데이터를 포맷팅, 압축, 검증할 수 있는 도구입니다.
        </p>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 JSON 입력
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleJson}
                  >
                    샘플 로드
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={validateJson}
                  >
                    검증
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                포맷팅하거나 압축할 JSON 데이터를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="JSON 데이터를 입력하세요..."
                className="w-full h-96 p-3 border border-input rounded-md bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              
              <div className="flex gap-2">
                <Button onClick={formatJson} className="flex-1">
                  🎨 포맷팅
                </Button>
                <Button onClick={minifyJson} variant="outline" className="flex-1">
                  🗜️ 압축
                </Button>
                <Button onClick={handleReset} variant="outline">
                  초기화
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 출력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📄 결과
                {output && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(output)}
                    className="ml-auto"
                  >
                    📋 복사
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                포맷팅되거나 압축된 JSON 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {output ? (
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-96 p-3 border border-input rounded-md bg-muted/20 text-sm font-mono resize-none"
                />
              ) : (
                <div className="h-96 flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-md text-muted-foreground">
                  JSON을 입력하고 포맷팅 또는 압축 버튼을 클릭하세요.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 통계 카드 */}
        {stats && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 JSON 통계
              </CardTitle>
              <CardDescription>
                JSON 구조와 데이터 타입별 통계입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.keys}</div>
                  <div className="text-sm text-muted-foreground">키 개수</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.objects}</div>
                  <div className="text-sm text-muted-foreground">객체</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.arrays}</div>
                  <div className="text-sm text-muted-foreground">배열</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.maxDepth}</div>
                  <div className="text-sm text-muted-foreground">최대 깊이</div>
                </div>
              </div>
              
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <span className="text-sm">문자열</span>
                  <Badge variant="secondary">{stats.strings}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <span className="text-sm">숫자</span>
                  <Badge variant="secondary">{stats.numbers}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <span className="text-sm">불린</span>
                  <Badge variant="secondary">{stats.booleans}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <span className="text-sm">null</span>
                  <Badge variant="secondary">{stats.nulls}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 사용법 가이드 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 사용법 가이드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">🎨 포맷팅</h4>
                <p className="text-sm text-muted-foreground">
                  압축된 JSON을 읽기 쉽게 들여쓰기와 줄바꿈을 추가합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🗜️ 압축</h4>
                <p className="text-sm text-muted-foreground">
                  불필요한 공백과 줄바꿈을 제거하여 JSON 크기를 최소화합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">✅ 검증</h4>
                <p className="text-sm text-muted-foreground">
                  JSON 문법이 올바른지 확인하고 오류가 있다면 위치를 알려줍니다.
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>팁:</strong> 큰 JSON 파일도 처리할 수 있으며, 
                통계 정보를 통해 데이터 구조를 빠르게 파악할 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default JsonFormatter
