# Jazz Finder (Next)

### A next based app that lets you search for Jazz!

## Live Demo

https://jazz-finder-next.vercel.app/

## Short Description

Jazz Finder (working title) is an app that lets you search the internet and find relevant information about Jazz music and culture. This project is just a start. It utilizes a huge dataset (+40.000 entries) of old jazz recordings, including all kinds of relevant information an links to media. The dataset utilizes a dump from a former website (jazz-on-line.com, offline!). This project (https://saleach.neocities.org/jazzset/) consists not only of the dataset itelf, but also uploads of all the recordings on archive.org. This app lets you browse the data through a search form and also provide access to the mp3 / other media, either through the Archive.org API or direct links. The dataset itself is also directly available as a YAML-file and a python database.

## TODOs

- Figure out solution for Serverless function timing out on Vercel

## Milestones / Ideas for future releases

- Implement Icon Library (maybe from https://react-icons.github.io/react-icons/icons/fa6/)
- Improve way to access the data (maybe migrating it into a postress database, or writing a separate api for it, maybe use python)
- extend search functionality to more parameters: eg. Label, comma separated artists...
- Access the Discogs API to map the recordings/artists to discogs entries (many entries contain discog-ids for individual artists, else also a search function in discogs can be used), eg. to get images of artists
- MAYBE: Access the Musicbrainz API to map the recordings/artists to Musicbrainz entries, as a complement to discogs
- Further APIs (spotify, yt...) might be possible too

## Longer Story and Further Ideas

In my mind this is just the first step. Finding this dataset is a huge treasure and it comes directly in the right moment, because that project exists only since January 2024. I was aware of the former website that hosted all this information for years, but they didnt provide an API and also last year that website suddenly went offline without any prior notice. Since then I had an idea in my head to create an interactive app that utilizes different publicly avablable APIs and databases to display relevant information about Jazz music, dance and culture (and could theoretically be used for any data) and is flexible enough to adjust when the available data changes (eg. when APIs go offline, new APIs are created...). I wasnt planning to host any data myself, except maybe any data that a user wants to save. But maybe it would be even better to use this alsp as a crawler and safe the information, in case APIs go down again... Anyways, this is a bigger picture idea about what can be done. For now, I specifically want to work with this dataset and connect it to other APIs when helpful.

## Open Source & Collaboration

The idea is for this to be an open source project that can grow over time through many contributors. Right now there is no concrete plan to make this happen, but if you are curious about working on this project, please reach out to me on my Github acount!
