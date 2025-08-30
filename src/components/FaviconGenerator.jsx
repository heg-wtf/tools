import React, { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function FaviconGenerator() {
  const [text, setText] = useState('A')
  const [backgroundColor, setBackgroundColor] = useState('#000000')
  const [textColor, setTextColor] = useState('#ffffff')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontSize, setFontSize] = useState(24)
  const canvasRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')

  // 사용 가능한 폰트 목록
  const availableFonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black'
  ]

  // 일반적인 favicon 크기들
  const faviconSizes = [
    { size: 16, name: '16x16 (브라우저 탭)' },
    { size: 32, name: '32x32 (북마크)' },
    { size: 48, name: '48x48 (Windows)' },
    { size: 64, name: '64x64 (고해상도)' },
    { size: 128, name: '128x128 (Chrome 웹스토어)' },
    { size: 152, name: '152x152 (iOS)' },
    { size: 180, name: '180x180 (iOS 고해상도)' },
    { size: 192, name: '192x192 (Android)' },
    { size: 512, name: '512x512 (PWA)' }
  ]

  // 미리 정의된 색상 팔레트
  const colorPalette = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#008000', '#800000', '#008080', '#000080', '#808080',
    '#c0c0c0', '#ff69b4', '#ffd700', '#adff2f', '#87ceeb'
  ]

  // Canvas에 favicon 그리기
  const drawFavicon = (canvas, size = 32) => {
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    // 배경 그리기
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, size, size)

    // 텍스트 그리기
    ctx.fillStyle = textColor
    ctx.font = `bold ${Math.floor(size * 0.6)}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 텍스트가 너무 길면 잘라내기
    let displayText = text
    if (text.length > 3) {
      displayText = text.substring(0, 2) + '.'
    }
    
    ctx.fillText(displayText, size / 2, size / 2)
  }

  // 미리보기 업데이트
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      drawFavicon(canvas, 64) // 미리보기용 64x64
      setPreviewUrl(canvas.toDataURL())
    }
  }, [text, backgroundColor, textColor, fontFamily, fontSize])

  // 특정 크기로 다운로드
  const downloadFavicon = (size) => {
    const canvas = document.createElement('canvas')
    drawFavicon(canvas, size)
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `favicon-${size}x${size}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  // 모든 크기 일괄 다운로드
  const downloadAllSizes = () => {
    faviconSizes.forEach((item, index) => {
      setTimeout(() => {
        downloadFavicon(item.size)
      }, index * 100) // 100ms 간격으로 다운로드
    })
  }

  // ICO 파일 생성 (여러 크기를 하나의 파일로)
  const downloadAsICO = () => {
    // 간단한 ICO 파일 생성 (16x16, 32x32, 48x48 포함)
    const sizes = [16, 32, 48]
    const canvases = sizes.map(size => {
      const canvas = document.createElement('canvas')
      drawFavicon(canvas, size)
      return canvas
    })

    // 첫 번째 캔버스만 ICO로 다운로드 (실제 ICO 형식은 복잡하므로 PNG로 대체)
    const canvas = canvases[1] // 32x32 사용
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'favicon.ico'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  // 샘플 텍스트 로드
  const loadSample = (sampleText, bgColor, txtColor) => {
    setText(sampleText)
    setBackgroundColor(bgColor)
    setTextColor(txtColor)
  }

  // 리셋 기능
  const handleReset = () => {
    setText('A')
    setBackgroundColor('#000000')
    setTextColor('#ffffff')
    setFontFamily('Arial')
    setFontSize(24)
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Favicon 생성기</h1>
        <p className="text-muted-foreground mb-8">
          텍스트와 색상을 선택해서 다양한 크기의 favicon을 생성하고 다운로드할 수 있습니다.
        </p>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 설정 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚙️ Favicon 설정
                <div className="ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    초기화
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                텍스트, 색상, 폰트를 설정해서 favicon을 커스터마이징하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 텍스트 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">텍스트</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="A"
                  maxLength="5"
                  className="w-full p-3 border border-input rounded-md bg-background text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground">
                  최대 5글자까지 입력 가능합니다. 3글자 이상은 자동으로 줄여집니다.
                </p>
              </div>

              {/* 배경색 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">배경색</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 border border-input rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 p-2 border border-input rounded-md bg-background text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className="w-6 h-6 rounded border-2 border-muted hover:border-ring transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* 텍스트 색상 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">텍스트 색상</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-10 border border-input rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 p-2 border border-input rounded-md bg-background text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="w-6 h-6 rounded border-2 border-muted hover:border-ring transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* 폰트 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">폰트</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-3 border border-input rounded-md bg-background"
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* 샘플 버튼들 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">빠른 샘플</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample('A', '#4f46e5', '#ffffff')}
                  >
                    🅰️ 클래식
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample('🚀', '#000000', '#ffffff')}
                  >
                    🚀 이모지
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample('WEB', '#ff6b6b', '#ffffff')}
                  >
                    🌐 웹사이트
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample('DEV', '#2ecc71', '#ffffff')}
                  >
                    💻 개발
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 미리보기 및 다운로드 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👁️ 미리보기 & 다운로드
              </CardTitle>
              <CardDescription>
                생성된 favicon을 미리보고 다양한 크기로 다운로드하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 미리보기 */}
              <div className="text-center space-y-4">
                <canvas
                  ref={canvasRef}
                  className="border border-input rounded-lg mx-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
                <p className="text-sm text-muted-foreground">64x64 미리보기</p>
              </div>

              {/* 일괄 다운로드 버튼 */}
              <div className="space-y-2">
                <Button
                  onClick={downloadAllSizes}
                  className="w-full"
                  size="lg"
                >
                  📦 모든 크기 다운로드
                </Button>
                <Button
                  onClick={downloadAsICO}
                  variant="outline"
                  className="w-full"
                >
                  💾 ICO 파일로 다운로드
                </Button>
              </div>

              {/* 개별 크기 다운로드 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">개별 크기 다운로드</label>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {faviconSizes.map((item) => (
                    <Button
                      key={item.size}
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFavicon(item.size)}
                      className="justify-between"
                    >
                      <span>{item.name}</span>
                      <Badge variant="secondary">{item.size}px</Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사용 가이드 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Favicon 사용 가이드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">웹사이트 적용</h4>
                <p className="text-sm text-muted-foreground">
                  • HTML &lt;head&gt; 태그에 추가<br/>
                  • &lt;link rel="icon" href="favicon.ico"&gt;<br/>
                  • 다양한 크기를 함께 제공<br/>
                  • PWA용 192px, 512px 필수
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">권장 크기</h4>
                <p className="text-sm text-muted-foreground">
                  • 16x16: 브라우저 탭<br/>
                  • 32x32: 북마크, 주소창<br/>
                  • 180x180: iOS Safari<br/>
                  • 192x192: Android Chrome
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">디자인 팁</h4>
                <p className="text-sm text-muted-foreground">
                  • 단순하고 명확한 디자인<br/>
                  • 고대비 색상 사용<br/>
                  • 작은 크기에서도 인식 가능<br/>
                  • 브랜드 색상 활용
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>참고:</strong> 생성된 favicon은 PNG 형식입니다. 
                실제 ICO 파일이 필요한 경우 온라인 변환 도구를 사용하거나 
                여러 크기의 PNG를 함께 제공하는 것을 권장합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FaviconGenerator
