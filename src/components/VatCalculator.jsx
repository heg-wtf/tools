import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function VatCalculator() {
  const [supplyPrice, setSupplyPrice] = useState('')
  const [vatAmount, setVatAmount] = useState('')
  const [totalPrice, setTotalPrice] = useState('')
  const [calculationMode, setCalculationMode] = useState('supply-to-vat') // 'supply-to-vat' 또는 'vat-to-supply'

  const VAT_RATE = 0.1 // 부가세율 10%

  // 공급원가 → 부가세 계산
  const calculateVatFromSupply = (supply) => {
    const supplyNum = parseFloat(supply)
    if (isNaN(supplyNum) || supplyNum < 0) return { vat: '', total: '' }
    
    const vat = Math.round(supplyNum * VAT_RATE)
    const total = supplyNum + vat
    
    return { vat: vat.toLocaleString(), total: total.toLocaleString() }
  }

  // 부가세 → 공급원가 계산
  const calculateSupplyFromVat = (vat) => {
    const vatNum = parseFloat(vat)
    if (isNaN(vatNum) || vatNum < 0) return { supply: '', total: '' }
    
    const supply = Math.round(vatNum / VAT_RATE)
    const total = supply + vatNum
    
    return { supply: supply.toLocaleString(), total: total.toLocaleString() }
  }

  // 공급원가 입력 핸들러
  const handleSupplyPriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setSupplyPrice(value)
    setCalculationMode('supply-to-vat')
    
    if (value) {
      const result = calculateVatFromSupply(value)
      setVatAmount(result.vat)
      setTotalPrice(result.total)
    } else {
      setVatAmount('')
      setTotalPrice('')
    }
  }

  // 부가세 입력 핸들러
  const handleVatAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setVatAmount(value)
    setCalculationMode('vat-to-supply')
    
    if (value) {
      const result = calculateSupplyFromVat(value)
      setSupplyPrice(result.supply)
      setTotalPrice(result.total)
    } else {
      setSupplyPrice('')
      setTotalPrice('')
    }
  }

  // 초기화
  const handleReset = () => {
    setSupplyPrice('')
    setVatAmount('')
    setTotalPrice('')
    setCalculationMode('supply-to-vat')
  }

  // 숫자 포맷팅 (천 단위 콤마)
  const formatNumber = (num) => {
    if (!num) return ''
    return parseInt(num.replace(/,/g, '')).toLocaleString()
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">부가세 계산기</h1>
        <p className="text-muted-foreground mb-8">
          공급원가와 부가세를 양방향으로 계산할 수 있는 도구입니다. (부가세율 10%)
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 계산 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 계산 입력
                {calculationMode === 'supply-to-vat' && (
                  <Badge variant="secondary">공급원가 → 부가세</Badge>
                )}
                {calculationMode === 'vat-to-supply' && (
                  <Badge variant="secondary">부가세 → 공급원가</Badge>
                )}
              </CardTitle>
              <CardDescription>
                공급원가 또는 부가세 중 하나를 입력하면 자동으로 계산됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">공급원가 (원)</label>
                <Input
                  type="text"
                  placeholder="예: 100000"
                  value={supplyPrice ? formatNumber(supplyPrice) : ''}
                  onChange={handleSupplyPriceChange}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">부가세 (원)</label>
                <Input
                  type="text"
                  placeholder="예: 10000"
                  value={vatAmount ? formatNumber(vatAmount) : ''}
                  onChange={handleVatAmountChange}
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

          {/* 계산 결과 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 계산 결과
              </CardTitle>
              <CardDescription>
                입력된 값을 바탕으로 자동 계산된 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">공급원가</label>
                <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                  {supplyPrice ? `${formatNumber(supplyPrice)}원` : '-'}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">부가세 (10%)</label>
                <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                  {vatAmount ? `${formatNumber(vatAmount)}원` : '-'}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">총 금액</label>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-lg font-mono font-bold">
                  {totalPrice ? `${formatNumber(totalPrice)}원` : '-'}
                </div>
              </div>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">1. 공급원가 → 부가세 계산</h4>
                <p className="text-sm text-muted-foreground">
                  공급원가를 입력하면 부가세(10%)와 총 금액이 자동으로 계산됩니다.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. 부가세 → 공급원가 계산</h4>
                <p className="text-sm text-muted-foreground">
                  부가세를 입력하면 해당 부가세에 맞는 공급원가와 총 금액이 계산됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VatCalculator
