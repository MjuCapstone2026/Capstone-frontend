# ChatSendButton

## 개요

채팅 입력창 우측 전송 아이콘 버튼. 정사각형.

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
| 크기 | 44 × 44px | 동일 | 동일 | 동일 |
| Border Radius | `radius-lg` | 동일 | 동일 | 동일 |
| Border(`1px solid`) | `Light/Divider,Border` | `Dark/Divider,Border` | `Light/Divider,Border` | `Dark/Divider,Border` |
| 배경 | `Light/Primary,CTA Button` | `Dark/Primary,CTA Button` | `Light/Secondary Surface` | `Dark/Secondary Surface` |
| Elevation | `Light/elevation-2` | `Dark/elevation-2` | 없음 | 없음 |
| 아이콘 색상 | `Light/Primary Tint,Tag BG` | `Dark/Title,Body Text` | `Light/Caption,Hint` | `Dark/Caption,Hint` |

## 구현 구조

바깥 사각형(배경·테두리·Elevation)은 `Pressable` 컴포넌트로, 내부 전송 아이콘은 SVG 파일로 구성.

## 관련 아이콘 추가후, 경로 추가
`assets/icons/ic_chat_send.svg`

## 이미지

### Chat Send Button Disabled Dark/Light
![Chat Send Button Disabled Dark](ChatSendButtonDisabled-Dark.svg)
![Chat Send Button Disabled Light](ChatSendButtonDisabled-Light.svg)

### Chat Send Button Enabled Dark/Light
![Chat Send Button Enabled Dark](ChatSendButtonEnabled-Dark.svg)
![Chat Send Button Enabled Light](ChatSendButtonEnabled-Light.svg)
