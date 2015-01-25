# iPhoto Exporter

> So you've been formatting your computer and forgot to export my iPhoto library. Luckily you still have the library intact (e.g. on Dropbox or other backup media). You need a way to export the original photos and want to keep my created events intact.

This was my reason for making this little package. Are you in the same situation I hope you find this usefull.

The iPhoto Exporter will utilize an XML-file (`AlbumData.xml`) found inside the iPhoto library, parse the file to find your events and photos to these. Each event will be created as a folder with the event name and the original set of images (`masters`) will be copied to it.

### Installation
All you need is [Git][git] and [Node][node].

```sh
$ git clone git@github.com:simonjensen/iphoto-event-exporter.git
$ npm install
```

### Usage
Intro ...

```sh
Usage: iphoto-export [options]

Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -s, --src [src]      The source directory where your iPhoto Library is
    -d, --dest [dest]    The destination directory you want to export the event(s) to
    -l, --list [list]    List all events and indexes
    -i, --index [index]  Export a specific event by index
```

To get a list of available options:
```sh
$ node iphoto-export.js -h
```

To list all events in the iPhoto library:
```sh
$ node iphoto-export.js -s <path to iPhoto library> -d . -l
```

To export a single event:
```sh
$ node iphoto-export.js -s <path to iPhoto library> -d <path you want to export to> -i <index>
```

To export all the events:
```sh
$ node iphoto-export.js -s <path to iPhoto library> -d <path you want to export to>
```

### Disclaimer
I've only used tried this script on my one iPhoto library so I'm not 100% sure if the XML-structure targeted in this app will always hold true!

[git]:http://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[node]:http://nodejs.org