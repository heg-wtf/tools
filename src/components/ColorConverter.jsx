import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function ColorConverter() {
  const [color, setColor] = useState({
    hex: '#FF6B6B',
    rgb: { r: 255, g: 107, b: 107 },
    hsl: { h: 0, s: 100, l: 71 },
    hsv: { h: 0, s: 58, v: 100 },
    cmyk: { c: 0, m: 58, y: 58, k: 0 }
  })
  const [inputType, setInputType] = useState('hex')
  const [inputValue, setInputValue] = useState('#FF6B6B')

  // 색상 변환 함수들
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const hslToRgb = (h, s, l) => {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  const rgbToHsv = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, v = max

    const d = max - min
    s = max === 0 ? 0 : d / max

    if (max === min) {
      h = 0
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    }
  }

  const rgbToCmyk = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, Math.max(g, b))
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k)

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    }
  }

  const updateColor = (newRgb) => {
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
    const hsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b)
    const cmyk = rgbToCmyk(newRgb.r, newRgb.g, newRgb.b)

    setColor({
      hex,
      rgb: newRgb,
      hsl,
      hsv,
      cmyk
    })
  }

  const handleInputChange = (value) => {
    setInputValue(value)

    try {
      let newRgb
      
      switch (inputType) {
        case 'hex':
          newRgb = hexToRgb(value)
          if (newRgb) updateColor(newRgb)
          break
        case 'rgb':
          const rgbMatch = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
          if (rgbMatch) {
            newRgb = {
              r: parseInt(rgbMatch[1]),
              g: parseInt(rgbMatch[2]),
              b: parseInt(rgbMatch[3])
            }
            updateColor(newRgb)
          }
          break
        case 'hsl':
          const hslMatch = value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
          if (hslMatch) {
            newRgb = hslToRgb(
              parseInt(hslMatch[1]),
              parseInt(hslMatch[2]),
              parseInt(hslMatch[3])
            )
            updateColor(newRgb)
          }
          break
      }
    } catch (error) {
      console.log('색상 변환 오류:', error)
    }
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

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    updateColor({ r, g, b })
    setInputValue(rgbToHex(r, g, b))
  }

  const loadPresetColor = (presetHex) => {
    const rgb = hexToRgb(presetHex)
    if (rgb) {
      updateColor(rgb)
      setInputValue(presetHex)
    }
  }

  // 색상 팔레트 프리셋
  const colorPresets = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33',
    '#000000', '#FFFFFF', '#808080', '#FF0000', '#00FF00'
  ]

  const getContrastColor = (hex) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return '#000000'
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }

  const formatters = {
    hex: () => color.hex,
    rgb: () => `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
    rgba: () => `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, 1)`,
    hsl: () => `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
    hsla: () => `hsla(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%, 1)`,
    hsv: () => `hsv(${color.hsv.h}, ${color.hsv.s}%, ${color.hsv.v}%)`,
    cmyk: () => `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">색상 변환기</h1>
        <p className="text-muted-foreground mb-8">
          다양한 색상 포맷(HEX, RGB, HSL, HSV, CMYK) 간의 변환을 지원합니다.
        </p>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 색상 입력
              </CardTitle>
              <CardDescription>
                색상을 입력하거나 선택해보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">입력 형식</label>
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="hex">HEX (#RRGGBB)</option>
                  <option value="rgb">RGB (rgb(r,g,b))</option>
                  <option value="hsl">HSL (hsl(h,s%,l%))</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">색상 값</label>
                <Input
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={
                    inputType === 'hex' ? '#FF6B6B' :
                    inputType === 'rgb' ? 'rgb(255, 107, 107)' :
                    'hsl(0, 100%, 71%)'
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">색상 선택기</label>
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => {
                    const rgb = hexToRgb(e.target.value)
                    if (rgb) {
                      updateColor(rgb)
                      setInputValue(e.target.value)
                    }
                  }}
                  className="w-full h-12 border border-input rounded-md"
                />
              </div>

              <Button onClick={generateRandomColor} className="w-full">
                🎲 랜덤 색상 생성
              </Button>
            </CardContent>
          </Card>

          {/* 색상 미리보기 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👁️ 색상 미리보기
              </CardTitle>
              <CardDescription>
                선택된 색상의 미리보기와 정보입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="w-full h-32 rounded-md border-2 border-border flex items-center justify-center text-lg font-semibold"
                style={{ 
                  backgroundColor: color.hex,
                  color: getContrastColor(color.hex)
                }}
              >
                {color.hex}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">밝기</div>
                  <div className="text-muted-foreground">
                    {Math.round((color.rgb.r * 299 + color.rgb.g * 587 + color.rgb.b * 114) / 1000)}
                  </div>
                </div>
                <div>
                  <div className="font-medium">채도</div>
                  <div className="text-muted-foreground">{color.hsl.s}%</div>
                </div>
                <div>
                  <div className="font-medium">색상</div>
                  <div className="text-muted-foreground">{color.hsl.h}°</div>
                </div>
                <div>
                  <div className="font-medium">명도</div>
                  <div className="text-muted-foreground">{color.hsl.l}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 변환 결과 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔄 변환 결과
              </CardTitle>
              <CardDescription>
                다양한 색상 포맷으로 변환된 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(formatters).map(([format, formatter]) => (
                <div key={format} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="space-y-1">
                    <div className="text-sm font-medium uppercase">{format}</div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {formatter()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(formatter())}
                  >
                    📋
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 색상 팔레트 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 색상 팔레트
            </CardTitle>
            <CardDescription>
              미리 정의된 색상을 클릭하여 선택할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {colorPresets.map((presetColor, index) => (
                <button
                  key={index}
                  className="w-12 h-12 rounded-md border-2 border-border hover:border-primary transition-colors"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => loadPresetColor(presetColor)}
                  title={presetColor}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 색상 이론 정보 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 색상 포맷 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">HEX (#RRGGBB)</h4>
                <p className="text-sm text-muted-foreground">
                  웹에서 가장 많이 사용되는 16진수 색상 코드입니다. 
                  #으로 시작하며 R, G, B 각각 2자리씩 표현합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">RGB (Red, Green, Blue)</h4>
                <p className="text-sm text-muted-foreground">
                  빨강, 초록, 파랑의 조합으로 색상을 표현합니다. 
                  각 값은 0-255 범위입니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">HSL (Hue, Saturation, Lightness)</h4>
                <p className="text-sm text-muted-foreground">
                  색상, 채도, 명도로 표현합니다. 
                  인간이 색상을 인지하는 방식과 유사합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">HSV (Hue, Saturation, Value)</h4>
                <p className="text-sm text-muted-foreground">
                  색상, 채도, 명도로 표현하며 HSL과 유사하지만 
                  명도 계산 방식이 다릅니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">CMYK</h4>
                <p className="text-sm text-muted-foreground">
                  인쇄에서 사용되는 색상 모델입니다. 
                  청록, 자홍, 노랑, 검정의 조합으로 표현합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">사용 팁</h4>
                <p className="text-sm text-muted-foreground">
                  • 웹: HEX, RGB 사용<br/>
                  • 디자인: HSL, HSV 사용<br/>
                  • 인쇄: CMYK 사용<br/>
                  • 접근성: 대비비 고려
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>접근성 팁:</strong> 텍스트와 배경색의 대비비는 최소 4.5:1 이상을 권장합니다. 
                중요한 정보는 7:1 이상의 대비비를 유지하세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ColorConverter
