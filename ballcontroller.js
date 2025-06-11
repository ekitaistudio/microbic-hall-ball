// 接收廣播訊息
radio.onReceivedString(function (receivedString) {
    if (receivedString == "HALL_TRIGGERED") {
        // 收到霍爾感應器觸發訊號
        robotMoving = true
        lastSignalTime = input.runningTime()
        basic.showIcon(IconNames.Heart)
        serial.writeLine("收到HALL_TRIGGERED - 機器人開始前進")
    }
})
let lastSignalTime = 0
let robotMoving = false
// 初始化
basic.showIcon(IconNames.Happy)
robotMoving = false
lastSignalTime = 0
// 設定無線電群組（需要與霍爾感應器micro:bit相同）
radio.setGroup(99)
/**
 * 機器人霍爾感應器控制程式
 * 
 * 接收到 HALL_TRIGGERED 廣播時機器人前進
 * 
 * 沒有收到廣播時機器人停止
 */
basic.forever(function () {
    // 檢查是否超過1秒沒收到訊號
    if (robotMoving && input.runningTime() - lastSignalTime > 1000) {
        // 超過1秒沒收到訊號，停止機器人
        robotMoving = false
        basic.showIcon(IconNames.Sad)
        serial.writeLine("超過1秒沒收到訊號 - 機器人停止")
    }
    if (robotMoving) {
        // 機器人前進
        pins.servoSetPulse(AnalogPin.P1, 2000)
        pins.servoSetPulse(AnalogPin.P2, 1000)
    } else {
        // 機器人停止
        pins.servoSetPulse(AnalogPin.P1, 1500)
        pins.servoSetPulse(AnalogPin.P2, 1500)
    }
    basic.pause(100)
})
