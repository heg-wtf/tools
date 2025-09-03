import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  // SQL 키워드 목록
  const SQL_KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
    'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL',
    'GROUP BY', 'HAVING', 'ORDER BY', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'ALTER', 'DROP', 'INDEX', 'DATABASE', 'SCHEMA', 'VIEW', 'PROCEDURE', 'FUNCTION',
    'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT', 'WITH'
  ]

  // SQL 포매팅 함수
  const formatSql = () => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      setStats(null)
      return
    }

    try {
      const formatted = prettifySQL(input)
      setOutput(formatted)
      setError('')
      
      const stats = analyzeSql(input)
      setStats(stats)
    } catch (err) {
      setError(`SQL 포맷팅 오류: ${err.message}`)
      setOutput('')
      setStats(null)
    }
  }

  // SQL 압축 함수
  const minifySql = () => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      setStats(null)
      return
    }

    try {
      const minified = input
        .replace(/\s+/g, ' ')  // 여러 공백을 하나로
        .replace(/\s*,\s*/g, ',')  // 콤마 주변 공백 제거
        .replace(/\s*\(\s*/g, '(')  // 괄호 주변 공백 제거
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*;\s*/g, ';')  // 세미콜론 주변 공백 제거
        .trim()
      
      setOutput(minified)
      setError('')
      
      const stats = analyzeSql(input)
      setStats(stats)
    } catch (err) {
      setError(`SQL 압축 오류: ${err.message}`)
      setOutput('')
      setStats(null)
    }
  }

  // SQL 문법 검증
  const validateSql = () => {
    if (!input.trim()) {
      setError('SQL을 입력해주세요.')
      return
    }

    try {
      const errors = []
      const sql = input.trim()
      
      // 기본적인 SQL 문법 검증
      if (!sql.match(/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)/i)) {
        errors.push('유효한 SQL 문으로 시작하지 않습니다.')
      }
      
      // 괄호 매칭 검사
      const openParens = (sql.match(/\(/g) || []).length
      const closeParens = (sql.match(/\)/g) || []).length
      if (openParens !== closeParens) {
        errors.push('괄호가 올바르게 매칭되지 않습니다.')
      }
      
      // 따옴표 매칭 검사 (기본적인)
      const singleQuotes = (sql.match(/'/g) || []).length
      if (singleQuotes % 2 !== 0) {
        errors.push('따옴표가 올바르게 매칭되지 않습니다.')
      }

      if (errors.length > 0) {
        setError(`❌ SQL 검증 오류:\n${errors.join('\n')}`)
      } else {
        setError('')
        alert('✅ 기본 SQL 문법 검증을 통과했습니다!')
      }
    } catch (err) {
      setError(`❌ SQL 검증 오류: ${err.message}`)
    }
  }

  // SQL 분석 함수
  const analyzeSql = (sql) => {
    const upperSql = sql.toUpperCase()
    const stats = {
      lines: sql.split('\n').length,
      characters: sql.length,
      words: sql.trim().split(/\s+/).length,
      keywords: 0,
      tables: new Set(),
      columns: new Set(),
      functions: new Set(),
      type: 'UNKNOWN'
    }

    // SQL 타입 감지
    if (upperSql.includes('SELECT')) stats.type = 'SELECT'
    else if (upperSql.includes('INSERT')) stats.type = 'INSERT'
    else if (upperSql.includes('UPDATE')) stats.type = 'UPDATE'
    else if (upperSql.includes('DELETE')) stats.type = 'DELETE'
    else if (upperSql.includes('CREATE')) stats.type = 'CREATE'
    else if (upperSql.includes('ALTER')) stats.type = 'ALTER'
    else if (upperSql.includes('DROP')) stats.type = 'DROP'

    // 키워드 카운트
    SQL_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = sql.match(regex)
      if (matches) {
        stats.keywords += matches.length
      }
    })

    // 테이블명 추출 (간단한 패턴)
    const fromMatches = sql.match(/FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi)
    if (fromMatches) {
      fromMatches.forEach(match => {
        const tableName = match.split(/\s+/)[1]
        if (tableName) stats.tables.add(tableName.toLowerCase())
      })
    }

    const joinMatches = sql.match(/JOIN\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi)
    if (joinMatches) {
      joinMatches.forEach(match => {
        const tableName = match.split(/\s+/)[1]
        if (tableName) stats.tables.add(tableName.toLowerCase())
      })
    }

    // 함수 감지
    const functionMatches = sql.match(/\b(COUNT|SUM|AVG|MIN|MAX|UPPER|LOWER|LENGTH|SUBSTRING|NOW|DATE)\s*\(/gi)
    if (functionMatches) {
      functionMatches.forEach(match => {
        const funcName = match.replace(/\s*\(.*/, '').trim()
        stats.functions.add(funcName.toUpperCase())
      })
    }

    return {
      ...stats,
      tables: Array.from(stats.tables),
      columns: Array.from(stats.columns),
      functions: Array.from(stats.functions)
    }
  }

  // SQL 포매팅 함수 (개선된 버전)
  const prettifySQL = (sql) => {
    let formatted = sql
      // 기본 정리
      .replace(/\s+/g, ' ')
      .trim()

    // 콤마 뒤에 줄바꿈 추가 (SELECT 절에서)
    formatted = formatted.replace(/,\s*/g, ',\n    ')
    
    // 주요 키워드 앞에 줄바꿈 추가
    const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET']
    majorKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      formatted = formatted.replace(regex, `\n${keyword}`)
    })

    // JOIN 문 포매팅
    formatted = formatted.replace(/\b(INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|JOIN)\b/gi, '\n$1')
    
    // ON 절 들여쓰기
    formatted = formatted.replace(/\bON\b/gi, '\n    ON')
    
    // AND, OR 조건 들여쓰기
    formatted = formatted.replace(/\b(AND|OR)\b/gi, '\n    $1')
    
    // CASE 문 포매팅
    formatted = formatted.replace(/\bCASE\b/gi, '\nCASE')
    formatted = formatted.replace(/\bWHEN\b/gi, '\n    WHEN')
    formatted = formatted.replace(/\bTHEN\b/gi, ' THEN')
    formatted = formatted.replace(/\bELSE\b/gi, '\n    ELSE')
    formatted = formatted.replace(/\bEND\b/gi, '\nEND')
    
    // UNION 포매팅
    formatted = formatted.replace(/\bUNION(\s+ALL)?\b/gi, '\n\nUNION$1\n')
    
    // INSERT VALUES 포매팅
    formatted = formatted.replace(/\bVALUES\b/gi, '\nVALUES')
    formatted = formatted.replace(/VALUES\s*\(/gi, 'VALUES\n    (')
    
    // UPDATE SET 포매팅
    formatted = formatted.replace(/\bSET\b/gi, '\nSET\n    ')

    // 괄호 내부 들여쓰기 (서브쿼리)
    const lines = formatted.split('\n')
    let indentLevel = 0
    const indentedLines = lines.map((line, index) => {
      const trimmed = line.trim()
      if (!trimmed) return ''
      
      // 닫는 괄호가 있으면 먼저 들여쓰기 레벨 감소
      const closingParens = (trimmed.match(/\)/g) || []).length
      const openingParens = (trimmed.match(/\(/g) || []).length
      
      // 현재 라인의 들여쓰기 계산
      let currentIndent = indentLevel
      
      // 닫는 괄호로 시작하면 들여쓰기 감소
      if (trimmed.startsWith(')')) {
        currentIndent = Math.max(0, indentLevel - 1)
      }
      
      const indentStr = '    '.repeat(currentIndent)
      
      // 들여쓰기 레벨 업데이트
      indentLevel += openingParens - closingParens
      indentLevel = Math.max(0, indentLevel)
      
      // 특정 키워드들은 기본 들여쓰기 적용
      if (trimmed.match(/^(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|UNION|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i)) {
        return indentStr + trimmed
      }
      
      // 이미 들여쓰기가 있는 라인은 추가 들여쓰기
      if (trimmed.match(/^(AND|OR|ON|WHEN|ELSE|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|JOIN)\b/i)) {
        return indentStr + '    ' + trimmed
      }
      
      // SELECT 절의 컬럼들
      if (index > 0 && lines[index - 1].trim().match(/^SELECT\b/i)) {
        return indentStr + '    ' + trimmed
      }
      
      return indentStr + trimmed
    })

    // 연속된 빈 줄 제거
    return indentedLines
      .join('\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
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

  const loadSampleSql = () => {
    const sample = `SELECT u.id, u.name, u.email, p.title as post_title, COUNT(c.id) as comment_count, CASE WHEN u.premium = 1 THEN '프리미엄' ELSE '일반' END as user_type FROM users u LEFT JOIN posts p ON u.id = p.user_id AND p.status = 'published' LEFT JOIN comments c ON p.id = c.post_id WHERE u.created_at >= '2024-01-01' AND u.status = 'active' AND (u.country = 'KR' OR u.country = 'US') GROUP BY u.id, u.name, u.email, p.title HAVING COUNT(c.id) > 0 ORDER BY comment_count DESC, u.name ASC LIMIT 100 OFFSET 0;`
    
    setInput(sample)
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">SQL 포맷터</h1>
        <p className="text-muted-foreground mb-8">
          SQL 쿼리를 포맷팅, 압축, 검증할 수 있는 도구입니다.
        </p>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🗃️ SQL 입력
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleSql}
                  >
                    샘플 로드
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={validateSql}
                  >
                    검증
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                포맷팅하거나 압축할 SQL 쿼리를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="SQL 쿼리를 입력하세요..."
                className="w-full h-96 p-3 border border-input rounded-md bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              
              <div className="flex gap-2">
                <Button onClick={formatSql} className="flex-1">
                  🎨 포맷팅
                </Button>
                <Button onClick={minifySql} variant="outline" className="flex-1">
                  🗜️ 압축
                </Button>
                <Button onClick={handleReset} variant="outline">
                  초기화
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 whitespace-pre-line">
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
                포맷팅되거나 압축된 SQL 결과입니다.
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
                  SQL을 입력하고 포맷팅 또는 압축 버튼을 클릭하세요.
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
                📊 SQL 분석
              </CardTitle>
              <CardDescription>
                SQL 구조와 통계 정보입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.lines}</div>
                  <div className="text-sm text-muted-foreground">라인 수</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.words}</div>
                  <div className="text-sm text-muted-foreground">단어 수</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.keywords}</div>
                  <div className="text-sm text-muted-foreground">키워드</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.characters}</div>
                  <div className="text-sm text-muted-foreground">문자 수</div>
                </div>
              </div>
              
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">쿼리 타입</span>
                    <Badge variant="secondary">{stats.type}</Badge>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">테이블 수</span>
                    <Badge variant="secondary">{stats.tables.length}</Badge>
                  </div>
                  {stats.tables.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {stats.tables.join(', ')}
                    </div>
                  )}
                </div>
                <div className="p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">함수 사용</span>
                    <Badge variant="secondary">{stats.functions.length}</Badge>
                  </div>
                  {stats.functions.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {stats.functions.join(', ')}
                    </div>
                  )}
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
                  SQL을 읽기 쉽게 들여쓰기와 줄바꿈을 추가합니다. 
                  키워드별로 적절한 위치에 줄바꿈을 삽입합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🗜️ 압축</h4>
                <p className="text-sm text-muted-foreground">
                  불필요한 공백과 줄바꿈을 제거하여 SQL 크기를 최소화합니다.
                  네트워크 전송 시 유용합니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">✅ 검증</h4>
                <p className="text-sm text-muted-foreground">
                  기본적인 SQL 문법을 검증하고 괄호, 따옴표 매칭을 확인합니다.
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>팁:</strong> 복잡한 쿼리도 처리할 수 있으며, 
                통계 정보를 통해 쿼리 구조를 빠르게 파악할 수 있습니다. 
                서브쿼리와 JOIN문도 적절히 포맷팅됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SqlFormatter
