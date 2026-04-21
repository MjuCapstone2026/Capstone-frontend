# PrimaryButton

## 개요
 
Figma에서 `ChatGenerateButton`과 `EditInfoButton`으로 나뉘어 있으나
라벨만 다르고 스타일 완전 동일 → 코드에서 `PrimaryButton` 하나로 재사용.
 
```tsx
<PrimaryButton label="채팅방 생성하기" onPress={...} />
<PrimaryButton label="수정하기" onPress={...} />
```
 
## Variants

| Variant | 설명 |
|---|---|
| enabled / Light | 활성, 라이트 |
| enabled / Dark | 활성, 다크 |
| disabled / Light | 비활성, 라이트 |
| disabled / Dark | 비활성, 다크 |

## 스타일

| 속성 | enabled Light | enabled Dark | disabled Light | disabled Dark |
|---|---|---|---|---|
| 크기 | 320 × 52px | 동일 | 동일 | 동일 |
| Border Radius | `radius-md` (12px) | 동일 | 동일 | 동일 |
| 배경 | `Light/Primary,CTA Button` | `Dark/Primary,CTA Button` | `Light/Secondary Surface` | `Dark/Secondary Surface` |
| Border(`1px solid`) | `Light/Primary Hover,Active` | `Dark/Primary Hover,Active` | `Light/Divider,Border` | `Dark/Divider,Border` |
| 텍스트(`heading-sm`) | `Light/Surface / Card BG` | 동일 | `Light/Placeholder,Disabled` | `Dark/Placeholder,Disabled` |
| Elevation | `Light/elevation-2` | `Dark/elevation-2` | 없음 | 없음 |

## 이미지

### ChatGenerateButton Disabled Dark/Light
![ChatGenerateButton Disabled Dark](ChatGenerateButtonDisabled-Dark.svg)
![ChatGenerateButton Disabled Light](ChatGenerateButtonDisabled-Light.svg)

### ChatGenerateButton Enabled Dark/Light
![ChatGenerateButton Enabled Dark](ChatGenerateButtonEnabled-Dark.svg)
![ChatGenerateButton Enabled Light](ChatGenerateButtonEnabled-Light.svg)

### EditInfoButton Disabled Dark/Light
![EditInfoButton Disabled Dark](EditInfoButtonDisabled-Dark.svg)
![EditInfoButton Disabled Light](EditInfoButtonDisabled-Light.svg)

### EditInfoButton Enabled Dark/Light
![EditInfoButton Enabled Dark](EditInfoButtonEnabled-Dark.svg)
![EditInfoButton Enabled Light](EditInfoButtonEnabled-Light.svg)