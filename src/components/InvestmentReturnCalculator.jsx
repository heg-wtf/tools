import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function InvestmentReturnCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('')
  const [finalValue, setFinalValue] = useState('')
  const [investmentPeriod, setInvestmentPeriod] = useState('')
  const [periodType, setPeriodType] = useState('years') // 'years' 또는 'months'
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [result, setResult] = useState(null)

  const calculateReturn = () => {
    const initial = parseFloat(initialInvestment)
    const final = parseFloat(finalValue)
    const period = parseFloat(investmentPeriod)
    const monthly = parseFloat(monthlyContribution) || 0

    if (isNaN(initial) || isNaN(final) || isNaN(period) || 
        initial <= 0 || final <= 0 || period <= 0) {
      setResult(null)
      return
    }

    // 기간을 년 단위로 변환
    const yearsInvested = periodType === 'years' ? period : period / 12
    
    // 총 투자 금액 (초기 투자 + 월 투자)
    const totalMonthlyContributions = monthly * (periodType === 'years' ? period * 12 : period)
    const totalInvested = initial + totalMonthlyContributions
    
    // 절대 수익
    const absoluteReturn = final - totalInvested
    
    // 수익률 계산
    const totalReturnRate = ((final - totalInvested) / totalInvested) * 100
    
    // 연평균 수익률 계산 (CAGR)
    const annualReturnRate = (Math.pow(final / totalInvested, 1 / yearsInvested) - 1) * 100

    setResult({
      totalInvested,
      totalMonthlyContributions,
      absoluteReturn,
      totalReturnRate,
      annualReturnRate,
      yearsInvested
    })
  }

  useEffect(() => {
    calculateReturn()
  }, [initialInvestment, finalValue, investmentPeriod, periodType, monthlyContribution])

  const handleReset = () => {
    setInitialInvestment('')
    setFinalValue('')
    setInvestmentPeriod('')
    setPeriodType('years')
    setMonthlyContribution('')
    setResult(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getReturnColor = (returnRate) => {
    if (returnRate > 0) return 'text-green-600 bg-green-50 border-green-200'
    if (returnRate < 0) return 'text-red-600 bg-red-50 border-red-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const getReturnIcon = (returnRate) => {
    if (returnRate > 0) return '📈'
    if (returnRate < 0) return '📉'
    return '➖'
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">투자 수익률 계산기</h1>
        <p className="text-muted-foreground mb-8">
          투자 금액과 현재 가치를 입력하여 수익률을 계산해보세요.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 투자 정보 입력
              </CardTitle>
              <CardDescription>
                투자 금액, 현재 가치, 투자 기간을 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">초기 투자 금액 (원)</label>
                <Input
                  type="number"
                  placeholder="예: 10000000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">현재 가치 (원)</label>
                <Input
                  type="number"
                  placeholder="예: 15000000"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">투자 기간</label>
                  <Input
                    type="number"
                    placeholder="예: 5"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">기간 단위</label>
                  <select
                    value={periodType}
                    onChange={(e) => setPeriodType(e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background text-lg"
                  >
                    <option value="years">년</option>
                    <option value="months">개월</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">월 추가 투자 (선택사항)</label>
                <Input
                  type="number"
                  placeholder="예: 500000"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="text-lg"
                />
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
                💰 수익률 분석
                {result && (
                  <Badge variant={result.totalReturnRate >= 0 ? "default" : "destructive"}>
                    {getReturnIcon(result.totalReturnRate)}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                투자 수익률 및 성과 분석 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">총 투자 금액</label>
                    <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                      {formatCurrency(result.totalInvested)}
                    </div>
                    {result.totalMonthlyContributions > 0 && (
                      <div className="text-xs text-muted-foreground">
                        초기: {formatCurrency(parseFloat(initialInvestment))}, 
                        월 투자: {formatCurrency(result.totalMonthlyContributions)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">절대 수익</label>
                    <div className={`p-3 border rounded-md text-lg font-mono ${getReturnColor(result.absoluteReturn)}`}>
                      {result.absoluteReturn >= 0 ? '+' : ''}{formatCurrency(result.absoluteReturn)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">총 수익률</label>
                    <div className={`p-3 border rounded-md text-lg font-mono font-bold ${getReturnColor(result.totalReturnRate)}`}>
                      {result.totalReturnRate >= 0 ? '+' : ''}{result.totalReturnRate.toFixed(2)}%
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">연평균 수익률 (CAGR)</label>
                    <div className={`p-3 border rounded-md text-lg font-mono font-bold ${getReturnColor(result.annualReturnRate)}`}>
                      {result.annualReturnRate >= 0 ? '+' : ''}{result.annualReturnRate.toFixed(2)}%
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-semibold text-blue-900 mb-2">투자 요약</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• 투자 기간: {result.yearsInvested.toFixed(1)}년</p>
                      <p>• 현재 가치: {formatCurrency(parseFloat(finalValue))}</p>
                      <p>• 투자 배수: {(parseFloat(finalValue) / result.totalInvested).toFixed(2)}배</p>
                      {monthlyContribution && (
                        <p>• 월 투자액: {formatCurrency(parseFloat(monthlyContribution))}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  필수 필드를 입력하면 수익률이 계산됩니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 수익률 해석 가이드 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 수익률 해석 가이드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-semibold">절대 수익</h4>
                <p className="text-sm text-muted-foreground">
                  실제로 얻은 수익 금액입니다. 현재 가치에서 총 투자 금액을 뺀 값입니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">총 수익률</h4>
                <p className="text-sm text-muted-foreground">
                  전체 투자 기간 동안의 총 수익률입니다. 투자 금액 대비 수익의 비율을 나타냅니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">연평균 수익률 (CAGR)</h4>
                <p className="text-sm text-muted-foreground">
                  연도별 평균 수익률입니다. 복리 효과를 고려한 연간 성장률을 의미합니다.
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                💡 <strong>참고:</strong> 코스피 연평균 수익률은 약 8-10%, S&P 500은 약 10-12%입니다. 
                이를 기준으로 투자 성과를 평가해보세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InvestmentReturnCalculator
