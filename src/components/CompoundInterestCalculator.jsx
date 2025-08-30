import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [years, setYears] = useState('')
  const [compoundFrequency, setCompoundFrequency] = useState('12') // 월복리
  const [result, setResult] = useState(null)

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal)
    const r = parseFloat(annualRate) / 100
    const t = parseFloat(years)
    const n = parseFloat(compoundFrequency)

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n) || p <= 0 || r < 0 || t <= 0 || n <= 0) {
      setResult(null)
      return
    }

    // 복리 공식: A = P(1 + r/n)^(nt)
    const amount = p * Math.pow((1 + r/n), n * t)
    const interest = amount - p

    setResult({
      finalAmount: amount,
      totalInterest: interest,
      monthlyContribution: 0
    })
  }

  useEffect(() => {
    calculateCompoundInterest()
  }, [principal, annualRate, years, compoundFrequency])

  const handleReset = () => {
    setPrincipal('')
    setAnnualRate('')
    setYears('')
    setCompoundFrequency('12')
    setResult(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getCompoundFrequencyLabel = (freq) => {
    switch(freq) {
      case '1': return '연복리'
      case '2': return '반년복리'
      case '4': return '분기복리'
      case '12': return '월복리'
      case '52': return '주복리'
      case '365': return '일복리'
      default: return `${freq}회 복리`
    }
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">복리 계산기</h1>
        <p className="text-muted-foreground mb-8">
          원금과 이자율을 입력하여 복리 수익을 계산해보세요.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 투자 조건 입력
              </CardTitle>
              <CardDescription>
                투자 원금, 연이율, 투자 기간을 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">원금 (원)</label>
                <Input
                  type="number"
                  placeholder="예: 1000000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">연이율 (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="예: 5.5"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">투자 기간 (년)</label>
                <Input
                  type="number"
                  placeholder="예: 10"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">복리 주기</label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-lg"
                >
                  <option value="1">연복리 (1년에 1회)</option>
                  <option value="2">반년복리 (1년에 2회)</option>
                  <option value="4">분기복리 (1년에 4회)</option>
                  <option value="12">월복리 (1년에 12회)</option>
                  <option value="52">주복리 (1년에 52회)</option>
                  <option value="365">일복리 (1년에 365회)</option>
                </select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="w-full"
              >
                초기화
              </Button>
            </CardContent>
          </Card>

          {/* 결과 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 계산 결과
                {result && (
                  <Badge variant="secondary">{getCompoundFrequencyLabel(compoundFrequency)}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                복리 효과를 포함한 투자 수익 계산 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">투자 원금</label>
                    <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                      {formatCurrency(parseFloat(principal))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">총 이자 수익</label>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-lg font-mono text-green-700">
                      {formatCurrency(result.totalInterest)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">최종 금액</label>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-lg font-mono font-bold">
                      {formatCurrency(result.finalAmount)}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-semibold text-blue-900 mb-2">투자 요약</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• 투자 기간: {years}년</p>
                      <p>• 연이율: {annualRate}%</p>
                      <p>• 복리 주기: {getCompoundFrequencyLabel(compoundFrequency)}</p>
                      <p>• 수익률: {((result.finalAmount / parseFloat(principal) - 1) * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  모든 필드를 입력하면 계산 결과가 표시됩니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 복리 효과 설명 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 복리의 힘
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">복리란?</h4>
                <p className="text-sm text-muted-foreground">
                  원금에서 발생한 이자가 다시 원금에 포함되어 이자를 발생시키는 것입니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">복리 주기의 영향</h4>
                                  <p className="text-sm text-muted-foreground">
                    복리 주기가 짧을수록 (일복리 &gt; 월복리 &gt; 연복리) 더 많은 수익을 얻을 수 있습니다.
                  </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">장기 투자의 중요성</h4>
                <p className="text-sm text-muted-foreground">
                  시간이 길수록 복리 효과가 기하급수적으로 증가합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompoundInterestCalculator
