function GetPlayerY () {
    if (Y == 0) {
        DrawY = 0
    } else if (Y == 1) {
        DrawY = 2
    } else if (Y == 2) {
        DrawY = 4
    }
}
input.onButtonPressed(Button.A, function () {
    if (!(GameOver)) {
        if (Y != 0) {
            led.unplot(1, DrawY)
            Y += -1
            GetPlayerY()
            led.plot(1, DrawY)
            music.playTone(500, music.beat(BeatFraction.Sixteenth))
        }
    }
})
function AskSound () {
    GameOver = true
    basic.clearScreen()
    basic.showString("S")
    basic.pause(500)
    basic.showString("?")
    basic.pause(500)
    basic.showLeds(`
        . . . . .
        . # . # .
        # . . . #
        . # . # .
        . . . . .
        `)
    while (true) {
        if (input.buttonIsPressed(Button.A)) {
            basic.showIcon(IconNames.Yes)
            Speaker = true
            music.setBuiltInSpeakerEnabled(true)
            basic.pause(1500)
            break;
        } else if (input.buttonIsPressed(Button.B)) {
            basic.showIcon(IconNames.No)
            Speaker = false
            music.setBuiltInSpeakerEnabled(false)
            basic.pause(1500)
            break;
        }
    }
    basic.clearScreen()
}
function GetStoneY () {
    if (StoneY == 0) {
        DrawStoneY = 0
    } else if (StoneY == 1) {
        DrawStoneY = 2
    } else if (StoneY == 2) {
        DrawStoneY = 4
    }
}
function FGameOver () {
    basic.pause(950)
    music.stopAllSounds()
    music.startMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.OnceInBackground)
    basic.clearScreen()
    basic.showString("Game over!")
    basic.pause(100)
    basic.showString("Score: ")
    basic.showNumber(Score)
    basic.pause(6100)
    control.reset()
}
input.onButtonPressed(Button.AB, function () {
    Speaker = !(Speaker)
    if (Speaker) {
        music.setBuiltInSpeakerEnabled(false)
    } else {
        music.setBuiltInSpeakerEnabled(true)
    }
})
input.onButtonPressed(Button.B, function () {
    if (!(GameOver)) {
        if (Y != 2) {
            led.unplot(1, DrawY)
            Y += 1
            GetPlayerY()
            led.plot(1, DrawY)
            music.playTone(500, music.beat(BeatFraction.Sixteenth))
        }
    }
})
let Draw2StoneY: number[] = []
let Start = false
let Score = 0
let GameOver = false
let StoneY = 0
let DrawStoneY = 0
let DrawY = 0
let Y = 0
let Speaker = false
AskSound()
Speaker = true
let SpeedRocks = 500
let SpeedGen = 3500
Y = 0
DrawY = 0
DrawStoneY = 0
StoneY = 0
GameOver = false
let StoneX = 5
Score = 0
led.plot(1, DrawY)
music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
loops.everyInterval(10000, function () {
    if (SpeedRocks > 100) {
        SpeedRocks += -50
    }
    if (SpeedGen > 1000) {
        SpeedGen += -500
    }
})
loops.everyInterval(SpeedGen, function () {
    if (Start) {
        if (!(GameOver)) {
            if (randint(0, 1) == 1) {
                Draw2StoneY = []
                for (let index = 0; index < 2; index++) {
                    StoneY = randint(0, 2)
                    GetStoneY()
                    Draw2StoneY.push(DrawStoneY)
                }
                for (let Index = 0; Index <= 4; Index++) {
                    StoneX = 4 - Index
                    led.plot(4 - Index, Draw2StoneY[0])
                    led.plot(4 - Index, Draw2StoneY[1])
                    music.playTone(700, music.beat(BeatFraction.Sixteenth))
                    basic.pause(SpeedRocks)
                    led.unplot(4 - Index, Draw2StoneY[0])
                    led.unplot(4 - Index, Draw2StoneY[1])
                    if (!(GameOver)) {
                        led.plot(1, DrawY)
                    }
                }
            } else {
                StoneY = randint(0, 2)
                GetStoneY()
                for (let Index2 = 0; Index2 <= 4; Index2++) {
                    StoneX = 4 - Index2
                    led.plot(4 - Index2, DrawStoneY)
                    music.playTone(700, music.beat(BeatFraction.Sixteenth))
                    basic.pause(SpeedRocks)
                    led.unplot(4 - Index2, DrawStoneY)
                    if (!(GameOver)) {
                        led.plot(1, DrawY)
                    }
                }
            }
        }
    } else {
        basic.pause(5000)
        Start = true
    }
})
// Draw
basic.forever(function () {
    if (!(GameOver)) {
        for (let Index3 = 0; Index3 <= 4; Index3++) {
            led.plot(Index3, 1)
        }
        for (let Index4 = 0; Index4 <= 4; Index4++) {
            led.plot(Index4, 3)
        }
        if (StoneY == Y && StoneX == 1) {
            GameOver = true
            led.unplot(1, DrawY)
            FGameOver()
        } else {
            for (let Value of Draw2StoneY) {
                if (Value == Y && StoneX == 1) {
                    GameOver = true
                    led.unplot(1, DrawY)
                    FGameOver()
                }
            }
        }
        if (StoneX == 0) {
            Score += 1
            StoneX = 5
        }
    }
})
