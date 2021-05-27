#!/usr/bin/env node
const readline = require('readline')
const Player = require('./player')
const fs = require('fs')
const path = require('path')
let isFirst = false
let volum = 100
//  setting play list
let playList = []

function getPlayList() {
    let dir = process.cwd()
    let files = fs.readdirSync(dir)
    playList = files.filter(function (file) {
        return path.extname(file).toLowerCase() === '.wav' || path.extname(file).toLowerCase() === '.mp3';
    })

}
getPlayList()
if (playList.length < 1) {
    console.log('no musics in this directory');
    process.exit()
}


let playing = 0
let playListCount = playList.length
const audio = new Player(playList[0])
audio.setVolume(volum)


async function nextSong() {
    playing++
    if (playing < playListCount) {

        audio.next(playList[playing])
        // console.log('current music - '+playList[playing]);
        log(true)
    } else {
        audio.destroy()
        process.exit()

    }
}


async function prevSong() {

    if (playing > 0) {
        playing--
        audio.next(playList[playing])
        audio.player.info().then(_ => {
            audio.play()
        })
        // console.log('current music - '+playList[playing]);
        log(true)
    }

}


function up() {
    if (volum < 200) {
        volum += 20
        audio.setVolume(volum)
        log(true)
    }
}

function down() {
    if (volum > 20) {
        volum -= 20
        audio.setVolume(volum)
        log(true)
    }
}

// Play Audio

audio.play()
// audio.volume=0.5

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function log(clear) {
    if (clear)
        process.stdout.write('\033c')
    console.log("\x1b[1m","\x1b[31m",'-----------',"\x1b[38m",'Welcome to T-Player',"\x1b[31m",'-----------',"\x1b[34m")
    console.log('current playing - ' + playList[playing])
    console.log('current volume - ' + volum, "\x1b[33m")
    console.log('--------------------------------------------------------');
    console.log(`| cmds -: stop | play | next | prev | up | down | exit |`)
    console.log('--------------------------------------------------------',"\x1b[36m"); 
}
log(true)
// console.log('current music - '+playList[playing])
rl.on('line', (input) => {

    if (input == 'stop')
        audio.pause()

    else if (input == 'play')
        audio.play()
    else if (input == 'next')
        nextSong()
    else if (input == 'prev')
        prevSong()
    else if (input == 'up')
        up()
    else if (input == 'down')
        down()
    else if (input == 'exit') {
        audio.destroy()
        process.exit()
    }
    log(true)

});


setInterval(() => {
    audio.player.info().then(res => {

        if (res.state === 'stopped' && isFirst) {
            nextSong()
        }
        isFirst = true
        
    })
}, 1000);