/**
 * 球型機器人控制程式
 * 
 * 接收廣播訊息開始繞圈
 * 
 * 接收到 "TRIGGERED" 廣播時機器人前進
 * 
 * 沒有收到廣播時機器人停止
 * 
 * 左輪比較快機器人會順時針繞圈
 * 
 * 內圈廣播22
 * 內圈P1:2000
 * 內圈P2:1230
 * 
 * 外圈廣播33
 * 外圈P1:2000
 * 外圈P2:1130
 */
// 接收廣播訊息
radio.onReceivedString(function (receivedString) {
    if (receivedString == "TRIGGERED") {
        // 收到感應器micro:bit觸發訊號
        robotMoving = true
        lastSignalTime = input.runningTime()
        basic.showIcon(IconNames.Heart)
        serial.writeLine("收到TRIGGERED - 機器人開始前進")
    }
})
let lastSignalTime = 0
let robotMoving = false
basic.showString("S22")
robotMoving = false
lastSignalTime = 0
// 設定無線電群組（需要與感應器micro:bit相同）
radio.setGroup(22)
basic.forever(function () {
    // 檢查是否超過1秒沒收到訊號
    if (robotMoving && input.runningTime() - lastSignalTime > 1000) {
        // 超過1秒沒收到訊號，停止機器人
        robotMoving = false
        basic.showIcon(IconNames.SmallSquare)
        serial.writeLine("超過1秒沒收到訊號 - 機器人停止")
    }
    if (robotMoving) {
        // 機器人繞圈圈前進（左輪較快，右輪較慢）
        // 左輪較快
        pins.servoSetPulse(AnalogPin.P1, 2000)
        // 右輪較慢
        pins.servoSetPulse(AnalogPin.P2, 1230)
    } else {
        // 機器人停止
        pins.servoSetPulse(AnalogPin.P1, 1500)
        pins.servoSetPulse(AnalogPin.P2, 1500)
    }
    basic.pause(100)
})
