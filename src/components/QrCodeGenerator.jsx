import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function QrCodeGenerator() {
  const [text, setText] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrSize, setQrSize] = useState(200)
  const [errorLevel, setErrorLevel] = useState('M')
  const [qrType, setQrType] = useState('text')
  const canvasRef = useRef(null)

  // QR 코드 타입별 템플릿
  const qrTemplates = {
    text: { label: '텍스트', placeholder: '텍스트를 입력하세요', prefix: '' },
    url: { label: 'URL', placeholder: 'https://example.com', prefix: '' },
    email: { label: '이메일', placeholder: 'user@example.com', prefix: 'mailto:' },
    phone: { label: '전화번호', placeholder: '010-1234-5678', prefix: 'tel:' },
    sms: { label: 'SMS', placeholder: '010-1234-5678,안녕하세요', prefix: 'sms:' },
    wifi: { label: 'WiFi', placeholder: 'SSID,password,WPA', prefix: 'WIFI:' },
    vcard: { label: '연락처', placeholder: '홍길동,010-1234-5678,hong@example.com', prefix: '' }
  }

  // 간단한 QR 코드 생성 함수 (실제로는 qrcode 라이브러리 사용 권장)
  const generateQRCode = async (data, size = 200) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    // 배경을 흰색으로 설정
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size, size)

    // QR 코드 패턴 시뮬레이션 (실제 QR 코드가 아닌 시각적 표현)
    const moduleSize = Math.floor(size / 25) // 25x25 모듈 그리드
    ctx.fillStyle = '#000000'

    // 간단한 패턴 생성 (실제 QR 코드 알고리즘이 아님)
    const pattern = generatePattern(data, 25)
    
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if (pattern[row][col]) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // finder patterns (모서리 사각형)
    drawFinderPattern(ctx, 0, 0, moduleSize)
    drawFinderPattern(ctx, 18 * moduleSize, 0, moduleSize)
    drawFinderPattern(ctx, 0, 18 * moduleSize, moduleSize)

    return canvas.toDataURL('image/png')
  }

  // 간단한 패턴 생성 (실제 QR 코드가 아닌 데모용)
  const generatePattern = (data, size) => {
    const pattern = Array(size).fill().map(() => Array(size).fill(false))
    
    // 데이터를 기반으로 한 간단한 해시 패턴
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) & 0xffffffff
    }

    const random = () => {
      hash = ((hash * 9301 + 49297) % 233280)
      return hash / 233280
    }

    for (let row = 3; row < size - 3; row++) {
      for (let col = 3; col < size - 3; col++) {
        // finder pattern 영역 제외
        if ((row < 9 && col < 9) || 
            (row < 9 && col > size - 10) || 
            (row > size - 10 && col < 9)) {
          continue
        }
        pattern[row][col] = random() > 0.5
      }
    }

    return pattern
  }

  // Finder pattern 그리기
  const drawFinderPattern = (ctx, x, y, moduleSize) => {
    // 외부 사각형 (7x7)
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize)
    
    // 내부 흰색 사각형 (5x5)
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize)
    
    // 중앙 검은색 사각형 (3x3)
    ctx.fillStyle = '#000000'
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize)
  }

  const formatQrData = (type, input) => {
    const template = qrTemplates[type]
    let formattedData = input

    switch (type) {
      case 'email':
        formattedData = `mailto:${input}`
        break
      case 'phone':
        formattedData = `tel:${input}`
        break
      case 'sms':
        const [phone, message] = input.split(',')
        formattedData = `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ''}`
        break
      case 'wifi':
        const [ssid, password, security = 'WPA'] = input.split(',')
        formattedData = `WIFI:T:${security};S:${ssid};P:${password};;`
        break
      case 'vcard':
        const [name, phoneNum, email] = input.split(',')
        formattedData = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phoneNum}\nEMAIL:${email}\nEND:VCARD`
        break
      default:
        formattedData = input
    }

    return formattedData
  }

  useEffect(() => {
    if (text.trim()) {
      const formattedData = formatQrData(qrType, text)
      generateQRCode(formattedData, qrSize).then(dataUrl => {
        if (dataUrl) setQrDataUrl(dataUrl)
      })
    } else {
      setQrDataUrl('')
    }
  }, [text, qrSize, errorLevel, qrType])

  const downloadQRCode = () => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.download = `qrcode_${Date.now()}.png`
    link.href = qrDataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setText('')
    setQrDataUrl('')
    setQrSize(200)
    setErrorLevel('M')
    setQrType('text')
  }

  const loadSample = () => {
    const samples = {
      text: '안녕하세요! QR 코드 테스트입니다.',
      url: 'https://github.com',
      email: 'test@example.com',
      phone: '010-1234-5678',
      sms: '010-1234-5678,안녕하세요 QR 코드 테스트입니다',
      wifi: 'MyWiFi,password123,WPA',
      vcard: '홍길동,010-1234-5678,hong@example.com'
    }
    setText(samples[qrType])
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">QR 코드 생성기</h1>
        <p className="text-muted-foreground mb-8">
          텍스트, URL, 연락처 등 다양한 정보를 QR 코드로 생성할 수 있습니다.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 설정 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚙️ QR 코드 설정
              </CardTitle>
              <CardDescription>
                QR 코드에 포함할 데이터와 설정을 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">QR 코드 타입</label>
                <select
                  value={qrType}
                  onChange={(e) => setQrType(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  {Object.entries(qrTemplates).map(([key, template]) => (
                    <option key={key} value={key}>{template.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {qrTemplates[qrType].label} 내용
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={qrTemplates[qrType].placeholder}
                  className="w-full h-24 p-3 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {qrType !== 'text' && qrType !== 'url' && (
                  <div className="text-xs text-muted-foreground">
                    {qrType === 'sms' && '형식: 전화번호,메시지'}
                    {qrType === 'wifi' && '형식: SSID,비밀번호,보안타입(WPA/WEP)'}
                    {qrType === 'vcard' && '형식: 이름,전화번호,이메일'}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">크기 (px)</label>
                  <Input
                    type="number"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    min="100"
                    max="500"
                    step="50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">오류 수정 레벨</label>
                  <select
                    value={errorLevel}
                    onChange={(e) => setErrorLevel(e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="L">L (낮음 ~7%)</option>
                    <option value="M">M (중간 ~15%)</option>
                    <option value="Q">Q (높음 ~25%)</option>
                    <option value="H">H (최고 ~30%)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={loadSample} variant="outline" className="flex-1">
                  샘플 로드
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* QR 코드 미리보기 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📱 QR 코드 미리보기
                {qrDataUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadQRCode}
                    className="ml-auto"
                  >
                    💾 다운로드
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                생성된 QR 코드를 미리보고 다운로드할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {qrDataUrl ? (
                  <>
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="border rounded-md shadow-sm"
                      style={{ width: qrSize, height: qrSize }}
                    />
                    <div className="text-center space-y-2">
                      <Badge variant="secondary">
                        {qrSize} × {qrSize} px
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        오류 수정 레벨: {errorLevel}
                      </p>
                    </div>
                  </>
                ) : (
                  <div 
                    className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md text-muted-foreground"
                    style={{ width: qrSize, height: qrSize }}
                  >
                    <div className="text-center">
                      <p className="text-sm">QR 코드 미리보기</p>
                      <p className="text-xs">내용을 입력하세요</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 숨겨진 캔버스 (QR 코드 생성용) */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* QR 코드 정보 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 QR 코드 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <h4 className="font-semibold">QR 코드란?</h4>
                <p className="text-sm text-muted-foreground">
                  Quick Response Code의 줄임말로, 2차원 바코드의 한 종류입니다. 
                  스마트폰 카메라로 쉽게 읽을 수 있습니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">오류 수정 기능</h4>
                <p className="text-sm text-muted-foreground">
                  QR 코드가 손상되어도 일정 부분까지는 복원 가능합니다. 
                  레벨이 높을수록 더 많은 손상을 복원할 수 있습니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">용도</h4>
                <p className="text-sm text-muted-foreground">
                  • URL 공유<br/>
                  • 연락처 교환<br/>
                  • WiFi 접속 정보<br/>
                  • 결제 정보<br/>
                  • 이벤트 정보
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">스캔 방법</h4>
                <p className="text-sm text-muted-foreground">
                  대부분의 스마트폰 카메라 앱이나 QR 코드 스캐너 앱으로 
                  쉽게 읽을 수 있습니다.
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>참고:</strong> 이 도구는 데모용 QR 코드 생성기입니다. 
                실제 프로덕션 환경에서는 전용 QR 코드 라이브러리 사용을 권장합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QrCodeGenerator
