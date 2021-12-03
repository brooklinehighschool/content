import { parse } from "https://deno.land/x/xml/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { ensureFile } from "https://deno.land/std@0.114.0/fs/mod.ts";
import pretty from 'https://cdn.skypack.dev/pretty';
import { parse as parsearg } from "https://deno.land/std@0.116.0/flags/mod.ts";

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

const url = await fetch("http://bhs.brookline.k12.ma.us/sitemap.xml")
const xml = await url.text()

const prefix = "http://bhs.brookline.k12.ma.us/"

const decoder = new TextDecoder("utf-8");

const xmldoc = parse(xml)

const urls = xmldoc?.urlset?.url

async function run(url: { loc: string }, rerun = true) {
    url.loc = url.loc.replace(prefix, "")

    let path = url.loc

    if (!path.endsWith('.html')) {
        path += '.html'
    }

    let fetchit;
    try {
        fetchit = await fetch(prefix + url.loc)
    } catch (_e) {
        console.log('taking a breather of 10 seconds, the program will be unresponsive')
        sleep(10000)
        run(url, rerun = false)
    }

    const datext = await fetchit?.text()

    const parsed = new DOMParser().parseFromString(datext, "text/html")

    if (parsed?.getElementById('login') != null) {
        console.log("skipping login page")
        return
    }

    let doc;
    try {
        doc = parsed?.getElementById('content')
    } catch (_e) {
        doc = parsed?.getElementById('wsite-content')
    }

    if (doc == null && rerun) {
        sleep(500)
        console.log('taking a breather of 0.5 seconds, the program will be unresponsive')
        run(url, rerun = false)
    }
    else if (doc == null) {
        console.log(`skipping ${url.loc}`)
        return
    }

    await ensureFile(`./raw/${path}`)
    try {
        await Deno.writeTextFile(`./raw/${path}`, pretty(doc.innerHTML))
    } catch (e) {
        if (rerun) {
            sleep(500)
            console.log('taking a breather of 0.5 seconds, the program will be unresponsive')
            run(url, rerun = false)
        }
        else {
            console.log(`skipping ${url.loc}`)
            console.log(e)
            Deno.remove(`./raw/${path}`)
            return
        }
    }
}

async function postprocess(url: { loc: string }) {
    url.loc = url.loc.replace(prefix, "")

    let path = url.loc
    if (!path.endsWith('.html')) {
        path += '.html'
    }

    let file;
    try {
        file = await Deno.readFile(`./raw/${path}`)
    }
    catch (e) {
        console.log(`${path} was missing, perhaps it was password protected`)
    }

    let content = decoder.decode(file)
    content = content.replace(/<.*?> ([\S\s] *?) <\/.*?>/, "$1");
    content = content.replace(/(^[ \t]*\n)/gm, "")

    await Deno.writeTextFile(`./raw/${path}`, content);

}

let i;
if (parsearg(Deno.args).f == true) {
    console.log('we are fetching');
    sleep(2000)
    console.log('no turning back!')
    sleep(1000)
    i = 0;
    for (const url of urls) {
        await run(url)
        console.log(`${i}/${urls.length - 1} (stage one)`)
        i++
    }
}

console.log('post processing, we are speed')
i = 0;
for (const url of urls) {
    await postprocess(url)
    console.log(`${i}/${urls.length - 1} (stage two)`)
    i++
}
