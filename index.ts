import { parse } from "https://deno.land/x/xml/mod.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import tds from 'https://cdn.skypack.dev/turndown@7.1.1';
import { ensureDir, ensureFile } from "https://deno.land/std@0.114.0/fs/mod.ts";

// this is a horrible idea
// because javascript is single threaded
// we can just kinda keep running this over and over again
// and nothing will happen
// this is really stupid
// don't ever do this
function sleep(miliseconds) {
    const currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }

const tdsserver = new tds({})


const url = await fetch("http://bhs.brookline.k12.ma.us/sitemap.xml")
const xml = await url.text()

const prefix = "http://bhs.brookline.k12.ma.us/"

let xmldoc = parse(xml)

const urls = xmldoc.urlset.url

async function run(url,rerun=true) {
    url.loc = url.loc.replace(prefix, "")
        
    const path = url.loc

    let fetchit;
    try {
        fetchit = await fetch(prefix + url.loc)
    } catch (e) {
        console.log('taking a breather of 10 seconds, the program will be unresponsive')
        sleep(10000)
        run(url, rerun=false)
    }

    const datext = await fetchit?.text()

    const parsed = new DOMParser().parseFromString(datext, "text/html")
    
    let doc;
    try { 
        doc = parsed?.getElementById('content')
    } catch (e) {
        doc = parsed?.getElementById('wsite-content')
    }

    if (parsed?.getElementById('login') != null) {
        console.log("skipping login page")
        return
    }

    if (doc == null && rerun) {
        sleep(500)
        console.log('taking a breather of 0.5 seconds, the program will be unresponsive')
        run(url, rerun=false)
    }
    else if (doc == null ) {
        console.log(`skipping ${url.loc}`)
        return
    }

    await ensureFile(`./posts/${path}.md`)
    try {
        await Deno.writeTextFile(`./posts/${path}.md`,tdsserver.turndown(doc))
    } catch(e) {
        if (rerun) {
            sleep(500)
            console.log('taking a breather of 0.5 seconds, the program will be unresponsive')
            run(url, rerun=false)
        }
        else {
            console.log(`skipping ${url.loc}`)
            console.log(e)
            console.debug(doc)
            Deno.remove(`./posts/${path}.md`)
            return
        }
    }
}

let i = 0;
for (const url of urls) {
    await run(url)
    console.log(`${i}/${urls.length}`)
    i++
}

