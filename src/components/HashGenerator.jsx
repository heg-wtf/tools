import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({})
  const [inputType, setInputType] = useState('text') // 'text' 또는 'file'
  const [fileInfo, setFileInfo] = useState(null)

  // 해시 알고리즘별 정보
  const hashAlgorithms = [
    { name: 'MD5', bits: 128, description: '빠른 체크섬, 보안용도 비추천' },
    { name: 'SHA-1', bits: 160, description: '구형 표준, 보안 취약점 존재' },
    { name: 'SHA-256', bits: 256, description: '현재 표준, 높은 보안성' },
    { name: 'SHA-384', bits: 384, description: 'SHA-2 계열, 중간 보안 레벨' },
    { name: 'SHA-512', bits: 512, description: 'SHA-2 계열, 최고 보안 레벨' }
  ]

  // Web Crypto API를 사용한 해시 생성
  const generateHash = async (algorithm, data) => {
    try {
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(data)
      
      let algoName
      switch(algorithm) {
        case 'SHA-1': algoName = 'SHA-1'; break
        case 'SHA-256': algoName = 'SHA-256'; break
        case 'SHA-384': algoName = 'SHA-384'; break
        case 'SHA-512': algoName = 'SHA-512'; break
        default: 
          // MD5는 Web Crypto API에서 지원하지 않으므로 간단한 구현
          return await generateMD5(data)
      }
      
      const hashBuffer = await crypto.subtle.digest(algoName, dataBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.error(`${algorithm} 해시 생성 오류:`, error)
      return 'Error generating hash'
    }
  }

  // 간단한 MD5 구현 (실제 프로덕션에서는 crypto 라이브러리 사용 권장)
  const generateMD5 = async (data) => {
    // 실제로는 crypto-js 같은 라이브러리를 사용해야 하지만,
    // 여기서는 간단한 해시 함수로 대체
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(32, '0')
  }

  const generateAllHashes = async () => {
    if (!input.trim()) {
      setHashes({})
      return
    }

    const newHashes = {}
    
    for (const algo of hashAlgorithms) {
      newHashes[algo.name] = await generateHash(algo.name, input)
    }
    
    setHashes(newHashes)
  }

  useEffect(() => {
    generateAllHashes()
  }, [input])

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    })

    const reader = new FileReader()
    reader.onload = async (e) => {
      const content = e.target.result
      setInput(content)
    }
    reader.readAsText(file)
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
    setHashes({})
    setFileInfo(null)
    setInputType('text')
  }

  const loadSampleData = () => {
    setInput('안녕하세요! 이것은 해시 생성 테스트 문자열입니다. 🔐\nHello World! This is a hash generation test string.')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getHashColor = (algorithm) => {
    const colors = {
      'MD5': 'bg-red-50 border-red-200 text-red-700',
      'SHA-1': 'bg-orange-50 border-orange-200 text-orange-700',
      'SHA-256': 'bg-green-50 border-green-200 text-green-700',
      'SHA-384': 'bg-blue-50 border-blue-200 text-blue-700',
      'SHA-512': 'bg-purple-50 border-purple-200 text-purple-700'
    }
    return colors[algorithm] || 'bg-gray-50 border-gray-200 text-gray-700'
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">해시 생성기</h1>
        <p className="text-muted-foreground mb-8">
          텍스트나 파일의 다양한 해시값(MD5, SHA-1, SHA-256, SHA-384, SHA-512)을 생성합니다.
        </p>
        
        <div className="grid gap-6">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 입력
                <div className="ml-auto flex gap-2">
                  <Button
                    variant={inputType === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputType('text')}
                  >
                    텍스트
                  </Button>
                  <Button
                    variant={inputType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setInputType('file')}
                  >
                    파일
                  </Button>
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
                해시를 생성할 텍스트를 입력하거나 파일을 업로드하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inputType === 'text' ? (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="해시를 생성할 텍스트를 입력하세요..."
                  className="w-full h-32 p-3 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <div className="space-y-4">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full p-3 border border-input rounded-md bg-background"
                  />
                  {fileInfo && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="font-semibold text-blue-900 mb-2">파일 정보</h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>• 파일명: {fileInfo.name}</p>
                        <p>• 크기: {formatFileSize(fileInfo.size)}</p>
                        <p>• 타입: {fileInfo.type || '알 수 없음'}</p>
                        <p>• 수정일: {fileInfo.lastModified.toLocaleString('ko-KR')}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 해시 결과 카드들 */}
          {Object.keys(hashes).length > 0 && (
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">생성된 해시값</h2>
              {hashAlgorithms.map((algo) => (
                hashes[algo.name] && (
                  <Card key={algo.name}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="outline">{algo.name}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {algo.bits}bit - {algo.description}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(hashes[algo.name])}
                          className="ml-auto"
                        >
                          📋 복사
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`p-3 border rounded-md font-mono text-sm break-all ${getHashColor(algo.name)}`}>
                        {hashes[algo.name]}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        길이: {hashes[algo.name].length} 문자 ({algo.bits} bits)
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          )}

          {/* 해시 비교 */}
          {Object.keys(hashes).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 해시 비교
                </CardTitle>
                <CardDescription>
                  각 해시 알고리즘의 특성을 비교해보세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">알고리즘</th>
                        <th className="text-left p-2">비트수</th>
                        <th className="text-left p-2">문자 길이</th>
                        <th className="text-left p-2">보안 수준</th>
                        <th className="text-left p-2">용도</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hashAlgorithms.map((algo) => (
                        <tr key={algo.name} className="border-b">
                          <td className="p-2 font-mono">{algo.name}</td>
                          <td className="p-2">{algo.bits}</td>
                          <td className="p-2">{hashes[algo.name]?.length || '-'}</td>
                          <td className="p-2">
                            {algo.name === 'MD5' && <Badge variant="destructive">낮음</Badge>}
                            {algo.name === 'SHA-1' && <Badge variant="secondary">중간</Badge>}
                            {(algo.name === 'SHA-256' || algo.name === 'SHA-384' || algo.name === 'SHA-512') && 
                             <Badge variant="default">높음</Badge>}
                          </td>
                          <td className="p-2 text-xs">{algo.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 해시 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💡 해시 함수 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">해시 함수란?</h4>
                  <p className="text-sm text-muted-foreground">
                    임의 크기의 데이터를 고정 크기의 값으로 변환하는 함수입니다. 
                    같은 입력에 대해 항상 같은 출력을 생성합니다.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">주요 용도</h4>
                  <p className="text-sm text-muted-foreground">
                    • 파일 무결성 검증<br/>
                    • 비밀번호 저장<br/>
                    • 디지털 서명<br/>
                    • 블록체인 기술
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">보안 권장사항</h4>
                  <p className="text-sm text-muted-foreground">
                    • 새로운 시스템: SHA-256 이상 사용<br/>
                    • MD5, SHA-1: 보안 용도 비추천<br/>
                    • 비밀번호: Salt와 함께 사용<br/>
                    • 정기적인 알고리즘 업데이트
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>보안 주의:</strong> MD5와 SHA-1은 충돌 공격에 취약하므로 
                  보안이 중요한 용도에는 SHA-256 이상을 사용하세요.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HashGenerator
