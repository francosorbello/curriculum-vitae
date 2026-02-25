import pluginRss from '@11ty/eleventy-plugin-rss'
import markdownIt from 'markdown-it'

import * as filters from './utils/filters.js'
import * as transforms from './utils/transforms.js'
import * as shortcodes from './utils/shortcodes.js'
import iconsprite from './utils/iconsprite.js'


/**
 * Given a language, returns a collection with the following content:
 *  
 * - introduction: contains translated introduction file (placed in content folder)
 * - collections.work: contains translated work files (placed in work folder)
 * - collections.education: contains translated education files (placed in education folder)
 * 
 * @param {string} langTag language to translate to
 * @param {any} collectionsAPI object provided by eleventy "addCollection" function
*/
function langToCollections(langTag, collectionsAPI) {
    let collection = {}

    // get introduction based on language. introduction.md must have the "introduction" tag
    collection["introduction"] = collectionsAPI.getFilteredByTags(langTag, "introduction")

    const collections = ['work', 'education']
    collections.forEach((name) => {
        const folderRegex = new RegExp(`\/${name}\/`)
        const inEntryFolder = (item) =>
            item.inputPath.match(folderRegex) !== null

        const byStartDate = (a, b) => {
            if (a.data.start && b.data.start) {
                return a.data.start - b.data.start
            }
            return 0
        }

        collection[name] = collectionsAPI
            .getFilteredByTag(langTag)
            // .getAllSorted()
            .filter(inEntryFolder)
            .sort(byStartDate)
    })

    return collection
}

export default async function (config) {
    // Plugins
    config.addPlugin(pluginRss)

    // Filters
    Object.keys(filters).forEach((filterName) => {
        config.addFilter(filterName, filters[filterName])
    })

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        config.addTransform(transformName, transforms[transformName])
    })

    // Shortcode
    Object.entries(shortcodes).forEach(([shortcodeName, func]) => {
        config.addShortcode(shortcodeName, func)
    })

    // Icon Sprite
    config.addNunjucksAsyncShortcode('iconsprite', iconsprite)

    // Asset Watch Targets
    config.addWatchTarget('./src/assets')

    // Markdown
    config.setLibrary(
        'md',
        markdownIt({
            html: true,
            breaks: true,
            linkify: true,
            typographer: true
        })
    )

    // Layouts
    config.addLayoutAlias('base', 'base.njk')
    config.addLayoutAlias('resume', 'resume.njk')

    config.addCollection("en", function (collectionsAPI) {
        return langToCollections("english", collectionsAPI)
    })

    config.addCollection("es", function (collectionsAPI) {
        return langToCollections("spanish", collectionsAPI)
    })

    // Pass-through files
    config.addPassthroughCopy('src/robots.txt')
    config.addPassthroughCopy('src/assets/images')
    config.addPassthroughCopy('src/assets/fonts')

    // Deep-Merge
    config.setDataDeepMerge(true)

    // Migrate to Eleventy v1
    config.setLiquidOptions({
        strictFilters: false,
        dynamicPartials: false,
    });

    // Base Config
    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data'
        },
        templateFormats: ['njk', 'md', '11ty.js'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk'
    }
}
