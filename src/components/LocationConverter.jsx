import React from 'react'

function LocationConverter() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">주소 위경도 변환</h1>
        <p className="text-muted-foreground mb-8">
          주소를 위도/경도 좌표로 변환하거나 좌표를 주소로 변환하는 도구입니다.
        </p>
        
        {/* 여기에 향후 기능을 추가할 수 있습니다 */}
        <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            주소 위경도 변환 기능이 여기에 구현됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LocationConverter
