import React from 'react'

function VatCalculator() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">부가세 계산기</h1>
        <p className="text-muted-foreground mb-8">
          부가세를 포함한 금액을 계산하거나 부가세를 제외한 금액을 계산하는 도구입니다.
        </p>
        
        {/* 여기에 향후 기능을 추가할 수 있습니다 */}
        <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            부가세 계산 기능이 여기에 구현됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VatCalculator
