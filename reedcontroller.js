/**
 * 大磁簧開關模組測試程式 - 快速廣播版
 * 
 * 適用於大磁簧開關模組
 * 
 * 模組腳位連接
 * 
 * + 接 3V
 * 
 * G 接 GND
 * 
 * D0 接 P
 * 
 * A0 不接
 * 
 * 功能：當磁簧開關被觸發時會快速廣播通知其他micro:bit
 * 
 * 內圈廣播22
 * 
 * 外圈廣播33
 * 
 * 廣播訊號是"TRIGGERED"
 * 
 */
let lastBroadcastTime = 0
let isTriggered = false
let reedState = 0
let lastState = -1
// 設定無線電群組 (兩個micro:bit需要使用相同群組號)
radio.setGroup(101)
// 初始化顯示
basic.showString("REED101")
basic.pause(1000)
basic.clearScreen()
// 顯示初始狀態
basic.showIcon(IconNames.SmallSquare)
serial.writeLine("大磁簧開關已就緒")
serial.writeLine("模組連接: +→3V, G→GND, D0→P0")
// 主程式迴圈
basic.forever(function () {
    // 讀取磁簧開關狀態 (D0腳位)
    reedState = pins.digitalReadPin(DigitalPin.P0)
    // 只有狀態改變時才處理
    if (reedState != lastState) {
        if (reedState == 1) {
            // 磁簧開關斷開時輸出 HIGH (1)
            // 表示磁鐵遠離，開關斷開 - 這是觸發狀態
            isTriggered = true
            basic.showIcon(IconNames.Yes)
            serial.writeLine("磁簧開關斷開！觸發狀態 - 狀態: HIGH (1)")
            // 立即廣播觸發訊號
            radio.sendString("TRIGGERED")
            serial.writeLine("已廣播：TRIGGERED")
            lastBroadcastTime = input.runningTime()
        } else {
            // 磁簧開關閉合時通常輸出 LOW (0)
            // 表示磁鐵靠近，開關閉合 - 這是釋放狀態
            isTriggered = false
            basic.showIcon(IconNames.SmallSquare)
            serial.writeLine("磁簧開關閉合！釋放狀態 - 狀態: LOW (0)")
        }
        lastState = reedState
    }
})
