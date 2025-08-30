import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function Base64Encoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encode') // 'encode' 또는 'decode'
  const [inputType, setInputType] = useState('text') // 'text' 또는 'file'
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  const processText = () => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      setStats(null)
      return
    }

    try {
      let result = ''
      let originalSize = 0
      let resultSize = 0

      if (mode === 'encode') {
        // UTF-8 인코딩을 고려한 Base64 인코딩
        const utf8Bytes = new TextEncoder().encode(input)
        result = btoa(String.fromCharCode(...utf8Bytes))
        originalSize = utf8Bytes.length
        resultSize = result.length
      } else {
        // Base64 디코딩
        const decodedBytes = Uint8Array.from(atob(input), c => c.charCodeAt(0))
        result = new TextDecoder().decode(decodedBytes)
        originalSize = input.length
        resultSize = new TextEncoder().encode(result).length
      }

      setOutput(result)
      setError('')
      
      setStats({
        originalSize,
        resultSize,
        sizeChange: resultSize - originalSize,
        sizeChangePercent: ((resultSize - originalSize) / originalSize) * 100
      })
    } catch (err) {
      setError(`${mode === 'encode' ? '인코딩' : '디코딩'} 오류: ${err.message}`)
      setOutput('')
      setStats(null)
    }
  }

  useEffect(() => {
    processText()
  }, [input, mode])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target.result
      if (mode === 'encode') {
        // 파일을 Base64로 인코딩
        const base64 = result.split(',')[1] // data:타입;base64, 부분 제거
        setInput('')
        setOutput(base64)
        
        setStats({
          originalSize: file.size,
          resultSize: base64.length,
          fileName: file.name,
          fileType: file.type,
          sizeChange: base64.length - file.size,
          sizeChangePercent: ((base64.length - file.size) / file.size) * 100
        })
      }
    }
    
    if (mode === 'encode') {
      reader.readAsDataURL(file)
    }
  }

  const downloadResult = () => {
    if (!output) return

    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mode === 'encode' ? 'encoded' : 'decoded'}_result.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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

  const handleReset = () => {
    setInput('')
    setOutput('')
    setError('')
    setStats(null)
  }

  const loadSampleData = () => {
    if (mode === 'encode') {
      setInput('안녕하세요! 이것은 Base64 인코딩 테스트입니다. 🚀\nHello World! This is a Base64 encoding test.')
    } else {
      setInput('7JWI64WV7ZWY7IS47JqUISCydOqyg+ydhCBCYXNlNjQg7J247L2U65SkIO2FjOyKpO2KuOyeheuLiOuLpC4g8J+agApIZWxsbyBXb3JsZCEgVGhpcyBpcyBhIEJhc2U2NCBlbmNvZGluZyB0ZXN0Lg==')
    }
  }

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Base64 인코더/디코더</h1>
        <p className="text-muted-foreground mb-8">
          텍스트와 파일을 Base64로 인코딩하거나 Base64를 디코딩할 수 있습니다.
        </p>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 입력
                <div className="ml-auto flex gap-2">
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="px-3 py-1 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="encode">인코딩</option>
                    <option value="decode">디코딩</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleData}
                  >
                    샘플 로드
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {mode === 'encode' ? 
                  '인코딩할 텍스트를 입력하거나 파일을 업로드하세요.' : 
                  '디코딩할 Base64 문자열을 입력하세요.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode === 'encode' && (
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={inputType === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputType('text')}
                  >
                    텍스트 입력
                  </Button>
                  <Button
                    variant={inputType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputType('file')}
                  >
                    파일 업로드
                  </Button>
                </div>
              )}

              {inputType === 'text' || mode === 'decode' ? (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? 
                    '인코딩할 텍스트를 입력하세요...' : 
                    'Base64 문자열을 입력하세요...'
                  }
                  className="w-full h-64 p-3 border border-input rounded-md bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <div className="space-y-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full p-3 border border-input rounded-md bg-background"
                  />
                  <div className="h-32 flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-md text-muted-foreground text-sm">
                    파일을 선택하면 자동으로 Base64로 인코딩됩니다.
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={handleReset} variant="outline" className="flex-1">
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
                <Badge variant="secondary">
                  {mode === 'encode' ? '인코딩됨' : '디코딩됨'}
                </Badge>
                {output && (
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(output)}
                    >
                      📋 복사
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResult}
                    >
                      💾 다운로드
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {mode === 'encode' ? 'Base64 인코딩' : '디코딩'} 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {output ? (
                <textarea
                  value={output}
                  readOnly
                  className="w-full h-64 p-3 border border-input rounded-md bg-muted/20 text-sm font-mono resize-none"
                />
              ) : (
                <div className="h-64 flex items-center justify-center border border-dashed border-muted-foreground/25 rounded-md text-muted-foreground">
                  {mode === 'encode' ? 
                    '텍스트를 입력하거나 파일을 업로드하면 Base64로 인코딩됩니다.' : 
                    'Base64 문자열을 입력하면 디코딩 결과가 표시됩니다.'
                  }
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
                📊 처리 통계
              </CardTitle>
              <CardDescription>
                인코딩/디코딩 전후의 크기 변화 정보입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatSize(stats.originalSize)}</div>
                  <div className="text-sm text-muted-foreground">원본 크기</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-green-600">{formatSize(stats.resultSize)}</div>
                  <div className="text-sm text-muted-foreground">결과 크기</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className={`text-2xl font-bold ${stats.sizeChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.sizeChange >= 0 ? '+' : ''}{formatSize(Math.abs(stats.sizeChange))}
                  </div>
                  <div className="text-sm text-muted-foreground">크기 변화</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className={`text-2xl font-bold ${stats.sizeChangePercent >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.sizeChangePercent >= 0 ? '+' : ''}{stats.sizeChangePercent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">변화율</div>
                </div>
              </div>
              
              {stats.fileName && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-semibold text-blue-900 mb-2">파일 정보</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• 파일명: {stats.fileName}</p>
                    <p>• 파일 타입: {stats.fileType || '알 수 없음'}</p>
                    <p>• 원본 크기: {formatSize(stats.originalSize)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Base64 정보 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Base64 인코딩 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Base64란?</h4>
                <p className="text-sm text-muted-foreground">
                  바이너리 데이터를 ASCII 문자열로 변환하는 인코딩 방식입니다. 
                  이메일이나 웹에서 바이너리 데이터를 안전하게 전송할 때 사용합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">사용 용도</h4>
                <p className="text-sm text-muted-foreground">
                  • 이미지, 파일을 텍스트로 변환<br/>
                  • 이메일 첨부파일 인코딩<br/>
                  • 웹 API에서 바이너리 데이터 전송<br/>
                  • 데이터 URL 스킴 (data:)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">특징</h4>
                <p className="text-sm text-muted-foreground">
                  • 원본 크기보다 약 33% 증가<br/>
                  • 64개의 ASCII 문자만 사용<br/>
                  • 패딩 문자 '=' 사용<br/>
                  • 줄바꿈이나 공백에 무관
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                💡 <strong>참고:</strong> Base64는 암호화가 아닌 인코딩입니다. 
                보안이 필요한 데이터는 별도의 암호화를 적용해야 합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Base64Encoder
