import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function TaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState('')
  const [deductionType, setDeductionType] = useState('standard') // 'standard' 또는 'itemized'
  const [dependents, setDependents] = useState('')
  const [additionalDeductions, setAdditionalDeductions] = useState('')
  const [taxType, setTaxType] = useState('income') // 'income' 또는 'comprehensive'
  const [result, setResult] = useState(null)

  // 2024년 기준 소득세율표
  const incomeTaxBrackets = [
    { min: 0, max: 14000000, rate: 0.06, cumulative: 0 },
    { min: 14000000, max: 50000000, rate: 0.15, cumulative: 840000 },
    { min: 50000000, max: 88000000, rate: 0.24, cumulative: 6240000 },
    { min: 88000000, max: 150000000, rate: 0.35, cumulative: 15360000 },
    { min: 150000000, max: 300000000, rate: 0.38, cumulative: 37060000 },
    { min: 300000000, max: 500000000, rate: 0.40, cumulative: 94060000 },
    { min: 500000000, max: 1000000000, rate: 0.42, cumulative: 174060000 },
    { min: 1000000000, max: Infinity, rate: 0.45, cumulative: 384060000 }
  ]

  const calculateTax = () => {
    const income = parseFloat(annualIncome)
    const dependentCount = parseFloat(dependents) || 0
    const additionalDeduct = parseFloat(additionalDeductions) || 0

    if (isNaN(income) || income <= 0) {
      setResult(null)
      return
    }

    // 기본 공제 계산
    const basicDeduction = 1500000 // 기본공제 150만원
    const dependentDeduction = dependentCount * 1500000 // 부양가족 1인당 150만원
    
    // 표준공제 vs 항목별공제
    const standardDeduction = 2000000 // 근로소득공제 등 표준공제
    const itemizedDeduction = additionalDeduct
    const selectedDeduction = deductionType === 'standard' ? standardDeduction : itemizedDeduction

    // 총 공제액
    const totalDeductions = basicDeduction + dependentDeduction + selectedDeduction

    // 과세표준
    const taxableIncome = Math.max(0, income - totalDeductions)

    // 소득세 계산
    let incomeTax = 0
    for (const bracket of incomeTaxBrackets) {
      if (taxableIncome > bracket.min) {
        const taxableAtThisBracket = Math.min(taxableIncome, bracket.max) - bracket.min
        incomeTax = bracket.cumulative + (taxableAtThisBracket * bracket.rate)
      } else {
        break
      }
    }

    // 지방소득세 (소득세의 10%)
    const localTax = incomeTax * 0.1

    // 총 세액
    const totalTax = incomeTax + localTax

    // 실수령액
    const netIncome = income - totalTax

    // 실효세율
    const effectiveTaxRate = (totalTax / income) * 100

    setResult({
      grossIncome: income,
      totalDeductions,
      taxableIncome,
      incomeTax,
      localTax,
      totalTax,
      netIncome,
      effectiveTaxRate,
      deductionBreakdown: {
        basic: basicDeduction,
        dependents: dependentDeduction,
        selected: selectedDeduction,
        type: deductionType
      }
    })
  }

  useEffect(() => {
    calculateTax()
  }, [annualIncome, deductionType, dependents, additionalDeductions, taxType])

  const handleReset = () => {
    setAnnualIncome('')
    setDeductionType('standard')
    setDependents('')
    setAdditionalDeductions('')
    setTaxType('income')
    setResult(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTaxBracket = (income) => {
    for (let i = 0; i < incomeTaxBrackets.length; i++) {
      if (income <= incomeTaxBrackets[i].max) {
        return {
          bracket: i + 1,
          rate: incomeTaxBrackets[i].rate * 100,
          min: incomeTaxBrackets[i].min,
          max: incomeTaxBrackets[i].max === Infinity ? '무제한' : incomeTaxBrackets[i].max.toLocaleString()
        }
      }
    }
    return null
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">소득세 계산기</h1>
        <p className="text-muted-foreground mb-8">
          2024년 소득세율표를 기준으로 소득세와 지방소득세를 계산해보세요.
        </p>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 소득 정보 입력
              </CardTitle>
              <CardDescription>
                연간 소득과 공제 정보를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">연간 총소득 (원)</label>
                <Input
                  type="number"
                  placeholder="예: 50000000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">부양가족 수</label>
                <Input
                  type="number"
                  placeholder="예: 2"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">공제 방식</label>
                <select
                  value={deductionType}
                  onChange={(e) => setDeductionType(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-lg"
                >
                  <option value="standard">표준공제 (200만원)</option>
                  <option value="itemized">항목별공제 (직접입력)</option>
                </select>
              </div>

              {deductionType === 'itemized' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">항목별 공제액 (원)</label>
                  <Input
                    type="number"
                    placeholder="예: 3000000"
                    value={additionalDeductions}
                    onChange={(e) => setAdditionalDeductions(e.target.value)}
                    className="text-lg"
                  />
                </div>
              )}
              
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
                💰 세금 계산 결과
                {result && (
                  <Badge variant="secondary">
                    실효세율 {result.effectiveTaxRate.toFixed(1)}%
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                소득세 및 지방소득세 계산 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">연간 총소득</label>
                    <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                      {formatCurrency(result.grossIncome)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">총 공제액</label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-lg font-mono">
                      -{formatCurrency(result.totalDeductions)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">과세표준</label>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-lg font-mono">
                      {formatCurrency(result.taxableIncome)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">소득세</label>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-lg font-mono">
                      {formatCurrency(result.incomeTax)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">지방소득세</label>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-lg font-mono">
                      {formatCurrency(result.localTax)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">총 세액</label>
                    <div className="p-3 bg-red-100 border border-red-300 rounded-md text-lg font-mono font-bold text-red-700">
                      {formatCurrency(result.totalTax)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">실수령액</label>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-lg font-mono font-bold text-green-700">
                      {formatCurrency(result.netIncome)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  연간 소득을 입력하면 세금이 계산됩니다.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 상세 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 세금 상세 정보
              </CardTitle>
              <CardDescription>
                공제 내역과 세율 정보입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="space-y-3">
                    <h4 className="font-semibold">공제 내역</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>기본공제</span>
                        <span>{formatCurrency(result.deductionBreakdown.basic)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>부양가족공제</span>
                        <span>{formatCurrency(result.deductionBreakdown.dependents)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{result.deductionBreakdown.type === 'standard' ? '표준공제' : '항목별공제'}</span>
                        <span>{formatCurrency(result.deductionBreakdown.selected)}</span>
                      </div>
                      <div className="border-t pt-2 font-semibold flex justify-between">
                        <span>총 공제액</span>
                        <span>{formatCurrency(result.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>

                  {result.taxableIncome > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">적용 세율 구간</h4>
                      {(() => {
                        const bracket = getTaxBracket(result.taxableIncome)
                        return bracket ? (
                          <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm">
                            <div>구간: {bracket.bracket}단계</div>
                            <div>세율: {bracket.rate}%</div>
                            <div>구간범위: {bracket.min.toLocaleString()}원 ~ {bracket.max}원</div>
                          </div>
                        ) : null
                      })()}
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold">월별 예상 금액</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>월 총소득</span>
                        <span>{formatCurrency(result.grossIncome / 12)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>월 세금</span>
                        <span>{formatCurrency(result.totalTax / 12)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>월 실수령액</span>
                        <span>{formatCurrency(result.netIncome / 12)}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  계산 결과가 나오면 상세 정보가 표시됩니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 소득세율표 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 2024년 소득세율표
            </CardTitle>
            <CardDescription>
              과세표준에 따른 소득세율 구간입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">구간</th>
                    <th className="text-left p-2">과세표준</th>
                    <th className="text-left p-2">세율</th>
                    <th className="text-left p-2">누진공제</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeTaxBrackets.map((bracket, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{index + 1}단계</td>
                      <td className="p-2">
                        {bracket.min.toLocaleString()}원 ~ {bracket.max === Infinity ? '무제한' : bracket.max.toLocaleString() + '원'}
                      </td>
                      <td className="p-2">{(bracket.rate * 100).toFixed(0)}%</td>
                      <td className="p-2">{bracket.cumulative.toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                💡 <strong>참고:</strong> 지방소득세는 소득세의 10%가 추가로 부과됩니다. 
                실제 세액은 각종 세액공제(근로소득세액공제, 자녀세액공제 등)를 적용한 후 최종 결정됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TaxCalculator
