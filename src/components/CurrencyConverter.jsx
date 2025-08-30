import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function CurrencyConverter() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('KRW')
  const [toCurrency, setToCurrency] = useState('USD')
  const [result, setResult] = useState(null)
  const [exchangeRates, setExchangeRates] = useState({})
  const [lastUpdated, setLastUpdated] = useState('')

  // 주요 통화 목록
  const currencies = [
    { code: 'KRW', name: '한국 원', symbol: '₩' },
    { code: 'USD', name: '미국 달러', symbol: '$' },
    { code: 'EUR', name: '유로', symbol: '€' },
    { code: 'JPY', name: '일본 엔', symbol: '¥' },
    { code: 'GBP', name: '영국 파운드', symbol: '£' },
    { code: 'CNY', name: '중국 위안', symbol: '¥' },
    { code: 'AUD', name: '호주 달러', symbol: 'A$' },
    { code: 'CAD', name: '캐나다 달러', symbol: 'C$' },
    { code: 'CHF', name: '스위스 프랑', symbol: 'CHF' },
    { code: 'HKD', name: '홍콩 달러', symbol: 'HK$' }
  ]

  // 모의 환율 데이터 (실제로는 API에서 가져와야 함)
  const mockExchangeRates = {
    KRW: { USD: 0.00075, EUR: 0.00070, JPY: 0.11, GBP: 0.00060, CNY: 0.0054, AUD: 0.0011, CAD: 0.0010, CHF: 0.00068, HKD: 0.0058 },
    USD: { KRW: 1333.33, EUR: 0.93, JPY: 146.67, GBP: 0.80, CNY: 7.20, AUD: 1.47, CAD: 1.33, CHF: 0.91, HKD: 7.75 },
    EUR: { KRW: 1433.33, USD: 1.08, JPY: 158.33, GBP: 0.86, CNY: 7.76, AUD: 1.58, CAD: 1.44, CHF: 0.98, HKD: 8.36 },
    JPY: { KRW: 9.05, USD: 0.0068, EUR: 0.0063, GBP: 0.0055, CNY: 0.049, AUD: 0.010, CAD: 0.0091, CHF: 0.0062, HKD: 0.053 },
    GBP: { KRW: 1666.67, USD: 1.25, EUR: 1.16, JPY: 183.33, CNY: 9.00, AUD: 1.84, CAD: 1.66, CHF: 1.14, HKD: 9.69 },
    CNY: { KRW: 185.19, USD: 0.139, EUR: 0.129, JPY: 20.37, GBP: 0.111, AUD: 0.204, CAD: 0.185, CHF: 0.126, HKD: 1.08 },
    AUD: { KRW: 907.41, USD: 0.68, EUR: 0.63, JPY: 99.63, GBP: 0.54, CNY: 4.90, CAD: 0.91, CHF: 0.62, HKD: 5.27 },
    CAD: { KRW: 1000.00, USD: 0.75, EUR: 0.69, JPY: 110.00, GBP: 0.60, CNY: 5.40, AUD: 1.10, CHF: 0.68, HKD: 5.81 },
    CHF: { KRW: 1470.59, USD: 1.10, EUR: 1.02, JPY: 161.76, GBP: 0.88, CNY: 7.94, AUD: 1.62, CAD: 1.47, HKD: 8.53 },
    HKD: { KRW: 172.41, USD: 0.129, EUR: 0.120, JPY: 18.97, GBP: 0.103, CNY: 0.93, AUD: 0.19, CAD: 0.172, CHF: 0.117 }
  }

  useEffect(() => {
    // 실제로는 환율 API를 호출해야 함
    setExchangeRates(mockExchangeRates)
    setLastUpdated(new Date().toLocaleString('ko-KR'))
  }, [])

  const convertCurrency = () => {
    const inputAmount = parseFloat(amount)
    
    if (isNaN(inputAmount) || inputAmount <= 0) {
      setResult(null)
      return
    }

    if (fromCurrency === toCurrency) {
      setResult({
        convertedAmount: inputAmount,
        rate: 1,
        fromCurrency,
        toCurrency,
        originalAmount: inputAmount
      })
      return
    }

    const rate = exchangeRates[fromCurrency]?.[toCurrency]
    if (!rate) {
      setResult(null)
      return
    }

    const convertedAmount = inputAmount * rate

    setResult({
      convertedAmount,
      rate,
      fromCurrency,
      toCurrency,
      originalAmount: inputAmount
    })
  }

  useEffect(() => {
    convertCurrency()
  }, [amount, fromCurrency, toCurrency, exchangeRates])

  const handleReset = () => {
    setAmount('')
    setFromCurrency('KRW')
    setToCurrency('USD')
    setResult(null)
  }

  const handleSwapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const formatCurrency = (amount, currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode)
    const symbol = currency?.symbol || currencyCode
    
    return new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: currencyCode === 'KRW' || currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'KRW' || currencyCode === 'JPY' ? 0 : 4
    }).format(amount) + ' ' + symbol
  }

  const getCurrencyName = (code) => {
    return currencies.find(c => c.code === code)?.name || code
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">환율 변환기</h1>
        <p className="text-muted-foreground mb-8">
          실시간 환율 정보를 바탕으로 통화를 변환해보세요.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 입력 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💱 환율 변환
                {lastUpdated && (
                  <Badge variant="secondary" className="text-xs">
                    {lastUpdated.split(' ')[1]} 업데이트
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                금액과 통화를 선택하여 환율을 변환하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">변환할 금액</label>
                <Input
                  type="number"
                  placeholder="예: 1000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">기준 통화</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-lg"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwapCurrencies}
                  className="px-4"
                >
                  ⇅ 통화 교환
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">변환 통화</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background text-lg"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
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
                💰 변환 결과
                {result && (
                  <Badge variant="default">
                    {fromCurrency} → {toCurrency}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                현재 환율을 기준으로 한 변환 결과입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">기준 금액</label>
                    <div className="p-3 bg-muted/50 rounded-md text-lg font-mono">
                      {formatCurrency(result.originalAmount, result.fromCurrency)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getCurrencyName(result.fromCurrency)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">변환 금액</label>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-lg font-mono font-bold">
                      {formatCurrency(result.convertedAmount, result.toCurrency)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getCurrencyName(result.toCurrency)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">환율</label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-lg font-mono">
                      1 {result.fromCurrency} = {result.rate.toFixed(6)} {result.toCurrency}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="font-semibold text-green-900 mb-2">변환 요약</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p>• {formatCurrency(result.originalAmount, result.fromCurrency)} ({getCurrencyName(result.fromCurrency)})</p>
                      <p>• ↓ 현재 환율: {result.rate.toFixed(6)}</p>
                      <p>• = {formatCurrency(result.convertedAmount, result.toCurrency)} ({getCurrencyName(result.toCurrency)})</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  금액을 입력하면 환율 변환 결과가 표시됩니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 주요 환율 정보 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 주요 환율 정보
            </CardTitle>
            <CardDescription>
              원화 기준 주요 통화의 현재 환율입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {currencies.filter(c => c.code !== 'KRW').map(currency => (
                <div key={currency.code} className="p-3 border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold">{currency.code}</span>
                    <span className="text-xs text-muted-foreground">{currency.name}</span>
                  </div>
                  <div className="font-mono text-lg">
                    {currency.symbol}1 = ₩{exchangeRates.KRW?.[currency.code] ? (1 / exchangeRates.KRW[currency.code]).toFixed(2) : '-'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                💡 <strong>참고:</strong> 환율은 실시간으로 변동됩니다. 실제 거래 시에는 금융기관의 최신 환율을 확인하세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CurrencyConverter
