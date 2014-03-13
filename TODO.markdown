#Todo

* ~~Express JS Elements~~
    * ~~CORS~~
    * ~~Basic Auth~~
* ~~services.json~~
    * ~~Station Name~~
    * ~~ID for API~~
    * ~~ID for MQTT~~
    * ~~ID for audio stream~~
    * ~~ID for now/next information~~
* ~~MQTT Service~~
    * ~~EventEmitter~~
        * ~~Livetext~~
        * ~~Track~~
    * ~~Normalise station ids using `services.json`~~
    * ~~Normalise event types to `eventName`~~
* ~~Audio Stream Service~~
    * ~~Call stream url for each station~~
    * ~~Parse playlist file, return timestamped endpoints~~
    * ~~Normalise station ids using `services.json`~~
    * ~~setInterval to reparse at a later time~~
    * ~~EventEmitter~~
        * ~~New stream URL~~
* ~~Nitro Service~~
    * ~~Call crafted JSON url for each station~~
    * ~~Return object per programme~~
        * ~~Episode~~
        * ~~Series~~
        * ~~Brand~~
        * ~~PID~~
        * ~~Start~~
        * ~~End~~
        * ~~Duration~~
    * ~~setInterval to check for new programmes from remaining duration~~
    * ~~Normalise station ids using `services.json`~~
    * ~~EventEmitter~~
        * ~~New programmes~~
* ~~SVG Logos~~
    * ~~Copy from old project~~
* ~~/stream~~
    * ~~Event Stream~~
    * ~~Emit on~~
        * ~~track / livetext event~~
        * ~~new stream URL~~
        * ~~now/new information~~
* ~~/services.json~~
    * ~~Title~~
    * ~~ID~~
    * ~~Streams~~
    * ~~NowAndNext~~
    * ~~Logos~~
