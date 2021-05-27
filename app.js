#!/usr/bin/env node
const readline = require('readline')
const Player = require('./player')
const fs = require('fs')
const path = require('path')
let isFirst = false
let volum = 100
//  setting play list
let playList = []

function getPlayList(){
    let dir = process.cwd()
    let files = fs.readdirSync(dir)
    playList = files.filter(function(file) {
        return path.extname(file).toLowerCase() === '.wav' || path.extname(file).toLowerCase() === '.mp3';
    })

}
getPlayList()
if (playList.length<1){
    console.log('no musics in this directory');
    process.exit()
}


let playing = 0
let playListCount = playList.length
const audio = new Player(playList[0])
audio.setVolume(volum)


async function nextSong(){
    playing++
    if (playing < playListCount){
        
        audio.next(playList[playing])
    }else{
        audio.destroy()
        process.exit()

    }
}


async function prevSong(){
    
    if (playing > 0){
        playing--
        audio.next(playList[playing])
        audio.player.info().then(_=>{
            audio.play()
        })
    }
}


function up(){
    if (volum<200){
        volum+=20
        audio.setVolume(volum)
    }
}

function down(){
    if (volum>20){
        volum-=20
        audio.setVolume(volum)
    }
}

// Play Audio

audio.play()
// audio.volume=0.5

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

console.log('Player Started');
console.log(`stop | play | next | prev | up | down | exit `);
rl.on('line', (input) => {

    if (input=='stop')
        audio.pause()
    
    else if (input=='play')
        audio.play()
    else if(input=='next')
        nextSong()
    else if(input=='prev')
        prevSong()
    else if(input=='up')
        up()
    else if(input=='down')
        down()
    else if(input == 'exit'){
        audio.destroy()
        process.exit()
    }

    console.log(`stop | play | next | prev | up | down | exit `);
  });


setInterval(() => {
    audio.player.info().then(res=>{
        
       if (res.state === 'stopped' && isFirst){
           nextSong()
       }
       isFirst = true
   })
}, 1000);