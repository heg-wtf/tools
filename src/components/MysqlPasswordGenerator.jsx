import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function MysqlPasswordGenerator() {
  const [plainPassword, setPlainPassword] = useState('')
  const [hashedPassword, setHashedPassword] = useState('')
  const [hashMethod, setHashMethod] = useState('mysql_native_password')
  const [copyMessage, setCopyMessage] = useState('')


  // SHA1 해시 함수 (간단한 구현)
  const sha1 = (str) => {
    const utf8 = unescape(encodeURIComponent(str))
    const words = []
    for (let i = 0; i < utf8.length; i++) {
      words[i >>> 2] |= (utf8.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8)
    }
    words[utf8.length >>> 2] |= 0x80 << (24 - (utf8.length % 4) * 8)
    words[((utf8.length + 8) >>> 6) + 1] = utf8.length * 8

    const h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]
    
    for (let i = 0; i < words.length; i += 16) {
      const w = words.slice(i, i + 16)
      for (let j = 16; j < 80; j++) {
        w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
      }
      
      let [a, b, c, d, e] = h
      
      for (let j = 0; j < 80; j++) {
        let f, k
        if (j < 20) {
          f = (b & c) | (~b & d)
          k = 0x5A827999
        } else if (j < 40) {
          f = b ^ c ^ d
          k = 0x6ED9EBA1
        } else if (j < 60) {
          f = (b & c) | (b & d) | (c & d)
          k = 0x8F1BBCDC
        } else {
          f = b ^ c ^ d
          k = 0xCA62C1D6
        }
        
        const temp = (rotateLeft(a, 5) + f + e + k + w[j]) & 0xffffffff
        e = d
        d = c
        c = rotateLeft(b, 30)
        b = a
        a = temp
      }
      
      h[0] = (h[0] + a) & 0xffffffff
      h[1] = (h[1] + b) & 0xffffffff
      h[2] = (h[2] + c) & 0xffffffff
      h[3] = (h[3] + d) & 0xffffffff
      h[4] = (h[4] + e) & 0xffffffff
    }
    
    return h.map(x => x.toString(16).padStart(8, '0')).join('').toUpperCase()
  }

  const rotateLeft = (n, s) => (n << s) | (n >>> (32 - s))

  // MySQL PASSWORD() 함수 시뮬레이션 (MySQL 4.1+)
  const mysqlPassword = (password) => {
    const hash1 = sha1(password)
    const hash2 = sha1(hexToBytes(hash1))
    return '*' + hash2
  }

  // 16진수 문자열을 바이트 배열로 변환
  const hexToBytes = (hex) => {
    const bytes = []
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(String.fromCharCode(parseInt(hex.substr(i, 2), 16)))
    }
    return bytes.join('')
  }

  // 강력한 비밀번호 생성 (기본 32자리)
  const generateStrongPassword = (length = 32) => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    const allChars = lowercase + uppercase + numbers + symbols
    let password = ''
    
    // 각 문자 유형에서 최소 하나씩 포함
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    
    // 나머지 길이만큼 랜덤하게 채우기
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // 문자 순서 섞기
    return password.split('').sort(() => 0.5 - Math.random()).join('')
  }

  // 비밀번호 해싱
  const handleHashPassword = () => {
    if (!plainPassword.trim()) return
    
    let hashed = ''
    switch (hashMethod) {
      case 'mysql_native_password':
        hashed = mysqlPassword(plainPassword)
        break
      case 'sha1':
        hashed = sha1(plainPassword)
        break
      default:
        hashed = mysqlPassword(plainPassword)
    }
    
    setHashedPassword(hashed)
    setCopyMessage('')
  }

  // 강력한 비밀번호 생성 및 해싱 (32자리)
  const generateAndHashPassword = () => {
    const newPassword = generateStrongPassword(32)
    setPlainPassword(newPassword)
    
    let hashed = ''
    switch (hashMethod) {
      case 'mysql_native_password':
        hashed = mysqlPassword(newPassword)
        break
      case 'sha1':
        hashed = sha1(newPassword)
        break
      default:
        hashed = mysqlPassword(newPassword)
    }
    
    setHashedPassword(hashed)
    

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

  // 초기화
  const handleReset = () => {
    setPlainPassword('')
    setHashedPassword('')
    setCopyMessage('')
  }



  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">MySQL 암호 생성기</h1>
        <p className="text-muted-foreground mb-8">
          MySQL에서 사용할 수 있는 암호화된 비밀번호를 생성하고 해싱할 수 있는 도구입니다.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 비밀번호 입력 및 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔐 비밀번호 해싱
                <Badge variant="secondary">{hashMethod}</Badge>
              </CardTitle>
              <CardDescription>
                32자리 비밀번호를 입력하거나 랜덤 생성하여 MySQL 해시로 변환합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">해싱 방법</label>
                <select 
                  value={hashMethod} 
                  onChange={(e) => setHashMethod(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="mysql_native_password">mysql_native_password</option>
                  <option value="sha1">SHA1</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">원본 비밀번호</label>
                <Input
                  type="text"
                  placeholder="32자리 비밀번호를 입력하세요"
                  value={plainPassword}
                  onChange={(e) => setPlainPassword(e.target.value)}
                  className="text-lg font-mono"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleHashPassword}
                  disabled={!plainPassword.trim()}
                  className="flex-1"
                >
                  해싱
                </Button>
                <Button 
                  variant="outline" 
                  onClick={generateAndHashPassword}
                >
                  32자리 랜덤 생성
                </Button>
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

          {/* 해싱 결과 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 해싱 결과
              </CardTitle>
              <CardDescription>
                생성된 해시를 MySQL에서 사용할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">원본 비밀번호</label>
                <div 
                  className="p-3 bg-muted/50 rounded-md text-sm font-mono cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => plainPassword && copyToClipboard(plainPassword)}
                >
                  {plainPassword || '-'}
                  {plainPassword && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (클릭하여 복사)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">해시된 비밀번호</label>
                <div 
                  className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm font-mono cursor-pointer hover:bg-primary/20 transition-colors break-all"
                  onClick={() => hashedPassword && copyToClipboard(hashedPassword)}
                >
                  {hashedPassword || '-'}
                  {hashedPassword && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (클릭하여 복사)
                    </span>
                  )}
                </div>
              </div>

              {hashedPassword && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">MySQL 사용 예시</label>
                  <div className="p-3 bg-muted/30 rounded-md text-xs font-mono">
                    <div>CREATE USER 'username'@'localhost'</div>
                    <div>IDENTIFIED BY PASSWORD '{hashedPassword.substring(0, 20)}...';</div>
                  </div>
                </div>
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
                <h4 className="font-semibold">1. 해싱 방법 선택</h4>
                <p className="text-sm text-muted-foreground">
                  MySQL 버전에 맞는 해싱 방법을 선택합니다. (기본: mysql_native_password)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. 비밀번호 입력/생성</h4>
                <p className="text-sm text-muted-foreground">
                  직접 32자리 비밀번호를 입력하거나 "32자리 랜덤 생성" 버튼으로 자동 생성합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. MySQL에서 사용</h4>
                <p className="text-sm text-muted-foreground">
                  생성된 해시를 MySQL의 CREATE USER 또는 SET PASSWORD 명령에서 사용합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MysqlPasswordGenerator
