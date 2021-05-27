const vlc = require("@richienb/vlc")

class Player {

    constructor(src) {

        this.playing = false
        this.volume = 1
        this.currentTime = 0
        this.src = src
        this.setup = (async () => {
            this.player = await vlc()
            if (src) {
                await this.player.command("in_enqueue", {
                    input: src
                })


            }
            this.timeUpdater = setInterval(async () => {
                const { length: duration, time: currentTime } = await this.player.info();
                this.duration = duration;
                this.currentTime = currentTime;
                // if (duration === 0 && currentTime === 0) {
                //     this.playing = false;
                // }
            }, 1000);
        })();
    }


    async play() {
        if (!this.playing) {
            this.playing = true;
            await this.setup;
            await this.player.command("pl_pause", {
                id: 0
            });
        }
    }

    async pause() {
        if (this.playing) {
            this.playing = false;
            await this.setup;
            await this.player.command("pl_pause", {
                id: 0
            });
        }
    }



    async next(value) {
        this.src = value;
        await this.setup;
        await this.player.command("pl_empty");
        await this.player.command("in_play", {
            input: value
        });
        this.player.info().then(_ => {
            this.play()
        })

    }

    async setVolume(value) {
        if (value>200 || value<0)
            return
        value = value/100
        await this.setup;
        this.volume = value;
        await this.player.command("volume", { val: Math.round(value * 256) });
       
    }

    destroy() {
        clearInterval(this.timeUpdater);
        this.player.kill();
    }

}
module.exports = Player
