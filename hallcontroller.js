/**
 * 數位霍爾感應器測試程式 - 快速廣播版本
 * 
 * 適用於感應器擴充版
 * 
 * 連接到 P0 腳位
 * 
 * 功能：當感應器被觸發時會快速廣播通知其他micro:bit
 * 
 * 廣播頻率：最慢每0.2秒發送一次
 */
// 按鈕A：顯示當前狀態
input.onButtonPressed(Button.A, function () {
    basic.clearScreen()
    basic.showString("P0:")
    basic.showNumber(pins.digitalReadPin(DigitalPin.P0))
    basic.pause(1500)
    basic.clearScreen()
})
// A+B：重新初始化
input.onButtonPressed(Button.AB, function () {
    basic.clearScreen()
    basic.showString("INIT")
    basic.pause(1000)
    basic.clearScreen()
    // 重設狀態
    lastState = -1
    lastBroadcastTime = 0
})
// 按鈕B：測試模式 - 連續顯示10秒狀態值
input.onButtonPressed(Button.B, function () {
    basic.clearScreen()
    basic.showString("TEST")
    for (let i = 0; i <= 19; i++) {
        value = pins.digitalReadPin(DigitalPin.P0)
        if (value == 0) {
            // 右上角亮起表示檢測到
            led.plot(4, 0)
        } else {
            // 熄滅
            led.unplot(4, 0)
        }
        serial.writeLine("測試 " + (i + 1) + "/20: " + value)
        basic.pause(500)
    }
    basic.clearScreen()
    basic.showString("DONE")
    basic.pause(1000)
    basic.clearScreen()
})
let hallState = 0
let value = 0
let lastBroadcastTime = 0
let lastState = 0
// 設定無線電群組 (兩個micro:bit需要使用相同群組號)
radio.setGroup(99)
lastState = -1
lastBroadcastTime = 0
// 初始化
basic.showString("HALL")
basic.pause(1000)
basic.clearScreen()
// 主程式迴圈
basic.forever(function () {
    // 讀取霍爾感應器狀態
    hallState = pins.digitalReadPin(DigitalPin.P0)
    // 只有狀態改變時才更新顯示
    if (hallState != lastState) {
        if (hallState == 0) {
            // 數位霍爾感應器通常是低電平觸發
            // 感應到磁場時輸出 LOW (0)
            basic.showIcon(IconNames.Heart)
            music.playTone(523, music.beat(BeatFraction.Quarter))
            serial.writeLine("磁場檢測到！狀態: LOW (0)")
            // 立即廣播第一次
            radio.sendString("HALL_TRIGGERED")
            serial.writeLine("已廣播：HALL_TRIGGERED")
            lastBroadcastTime = input.runningTime()
        } else {
            // 沒有磁場時輸出 HIGH (1)
            basic.showIcon(IconNames.SmallHeart)
            serial.writeLine("沒有磁場，狀態: HIGH (1)")
        }
        lastState = hallState
        basic.pause(50)
    }
    // 如果霍爾感應器仍被觸發，每0.2秒持續廣播
    if (hallState == 0 && input.runningTime() - lastBroadcastTime >= 200) {
        radio.sendString("HALL_TRIGGERED")
        serial.writeLine("持續廣播：HALL_TRIGGERED")
        lastBroadcastTime = input.runningTime()
    }
    // 中央LED指示器
    if (hallState == 0) {
        // 感應到磁場時點亮
        led.plot(2, 2)
    } else {
        // 沒有磁場時熄滅
        led.unplot(2, 2)
    }
    basic.pause(20)
})
