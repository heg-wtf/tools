import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [paymentType, setPaymentType] = useState('equal-payment') // 'equal-payment' 또는 'equal-principal'
  const [result, setResult] = useState(null)

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount)
    const monthlyRate = parseFloat(annualRate) / 100 / 12
    const totalMonths = parseFloat(loanTerm) * 12

    if (isNaN(principal) || isNaN(monthlyRate) || isNaN(totalMonths) || 
        principal <= 0 || monthlyRate < 0 || totalMonths <= 0) {
      setResult(null)
      return
    }

    if (paymentType === 'equal-payment') {
      // 원리금균등상환
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                            (Math.pow(1 + monthlyRate, totalMonths) - 1)
      const totalPayment = monthlyPayment * totalMonths
      const totalInterest = totalPayment - principal

      setResult({
        type: '원리금균등상환',
        monthlyPayment,
        totalPayment,
        totalInterest,
        schedule: generateEqualPaymentSchedule(principal, monthlyRate, totalMonths, monthlyPayment)
      })
    } else {
      // 원금균등상환
      const monthlyPrincipal = principal / totalMonths
      let totalPayment = 0
      let totalInterest = 0
      const schedule = []

      for (let month = 1; month <= totalMonths; month++) {
        const remainingPrincipal = principal - (monthlyPrincipal * (month - 1))
        const monthlyInterest = remainingPrincipal * monthlyRate
        const monthlyPayment = monthlyPrincipal + monthlyInterest
        
        totalPayment += monthlyPayment
        totalInterest += monthlyInterest

        if (month <= 12 || month % 12 === 0 || month > totalMonths - 12) {
          schedule.push({
            month,
            monthlyPayment,
            monthlyPrincipal,
            monthlyInterest,
            remainingBalance: remainingPrincipal - monthlyPrincipal
          })
        }
      }

      setResult({
        type: '원금균등상환',
        monthlyPayment: monthlyPrincipal + (principal * monthlyRate), // 첫 달 납입액
        totalPayment,
        totalInterest,
        schedule
      })
    }
  }

  const generateEqualPaymentSchedule = (principal, monthlyRate, totalMonths, monthlyPayment) => {
    const schedule = []
    let remainingBalance = principal

    for (let month = 1; month <= totalMonths; month++) {
      const monthlyInterest = remainingBalance * monthlyRate
      const monthlyPrincipal = monthlyPayment - monthlyInterest
      remainingBalance -= monthlyPrincipal

      if (month <= 12 || month % 12 === 0 || month > totalMonths - 12) {
        schedule.push({
          month,
          monthlyPayment,
          monthlyPrincipal,
          monthlyInterest,
          remainingBalance: Math.max(0, remainingBalance)
        })
      }
    }

    return schedule
  }

  useEffect(() => {
    calculateLoan()
  }, [loanAmount, annualRate, loanTerm, paymentType])

  const handleReset = () => {
    setLoanAmount('')
    setAnnualRate('')
    setLoanTerm('')
    setPaymentType('equal-payment')
    setResult(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">대출 계산기</h1>
        <p className="text-muted-foreground mb-8">
          대출 조건을 입력하여 월 상환액과 총 이자를 계산해보세요.
        </p>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏦 대출 조건 입력
              </CardTitle>
              <CardDescription>
                대출 금액, 금리, 기간을 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">대출 금액 (원)</label>
                <Input
                  type="number"
                  placeholder="예: 100000000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">연이율 (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="예: 3.5"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">대출 기간 (년)</label>
                <Input
                  type="number"
                  placeholder="예: 20"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">상환 방식</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-lg"
                >
                  <option value="equal-payment">원리금균등상환</option>
                  <option value="equal-principal">원금균등상환</option>
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
                  <Badge variant="secondary">{result.type}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                대출 상환 계획 및 총 비용입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {paymentType === 'equal-payment' ? '월 상환액 (고정)' : '첫 달 상환액'}
                    </label>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-lg font-mono font-bold">
                      {formatCurrency(result.monthlyPayment)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">총 상환액</label>
                    <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                      {formatCurrency(result.totalPayment)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">총 이자</label>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-lg font-mono text-red-700">
                      {formatCurrency(result.totalInterest)}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-semibold text-blue-900 mb-2">대출 요약</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• 대출 기간: {loanTerm}년 ({parseFloat(loanTerm) * 12}개월)</p>
                      <p>• 연이율: {annualRate}%</p>
                      <p>• 상환 방식: {result.type}</p>
                      <p>• 이자 비율: {((result.totalInterest / parseFloat(loanAmount)) * 100).toFixed(2)}%</p>
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

          {/* 상환 스케줄 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 상환 스케줄
              </CardTitle>
              <CardDescription>
                주요 시점별 상환 내역입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result && result.schedule ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.schedule.map((payment, index) => (
                    <div key={index} className="p-3 border rounded-md text-xs">
                      <div className="font-semibold mb-1">{payment.month}개월차</div>
                      <div className="space-y-1 text-muted-foreground">
                        <div>상환액: {formatCurrency(payment.monthlyPayment)}</div>
                        <div>원금: {formatCurrency(payment.monthlyPrincipal)}</div>
                        <div>이자: {formatCurrency(payment.monthlyInterest)}</div>
                        <div>잔액: {formatCurrency(payment.remainingBalance)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  계산 결과가 나오면 상환 스케줄이 표시됩니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 상환 방식 설명 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 상환 방식 비교
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">원리금균등상환</h4>
                <p className="text-sm text-muted-foreground">
                  매월 동일한 금액을 상환합니다. 초기에는 이자 비중이 높고, 후반에는 원금 비중이 높아집니다.
                </p>
                <div className="text-xs text-green-600">
                  ✓ 매월 일정한 상환액으로 가계 관리 용이
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">원금균등상환</h4>
                <p className="text-sm text-muted-foreground">
                  매월 동일한 원금을 상환하고, 이자는 잔여 원금에 따라 감소합니다. 초기 부담이 크지만 총 이자가 적습니다.
                </p>
                <div className="text-xs text-green-600">
                  ✓ 총 이자 부담이 적어 경제적
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoanCalculator
